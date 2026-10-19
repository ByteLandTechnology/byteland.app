---
title: "LangGraph 1.2.16: Resume an Agent Without Repeating Finished Work"
date: "2026-10-19"
description: "A correct final state can hide repeated actions. We compare LangGraph 1.2.15 and 1.2.16 on real resume regressions, then check what the patch does not guarantee."
tags: [AI]
author: "The ByteLand Team"
image: "./langgraph-resume/cover.svg"
draft: false
---

<figure style={{margin: "0 0 32px"}}>
<video controls playsInline preload="metadata" aria-label="LangGraph resume fixes and repeated action checks" poster="/posts/2026-10/langgraph-resume/poster.jpg" style={{display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", borderRadius: "16px"}}>
  <source src="/posts/2026-10/langgraph-resume/langgraph-resume-v1.mp4" type="video/mp4" />
  <track kind="subtitles" src="/posts/2026-10/langgraph-resume/captions.en.vtt" srcLang="en" label="English" default />
  <track kind="subtitles" src="/posts/2026-10/langgraph-resume/captions.zh-Hans.vtt" srcLang="zh-Hans" label="简体中文" />
  <track kind="subtitles" src="/posts/2026-10/langgraph-resume/captions.zh-Hant.vtt" srcLang="zh-Hant" label="繁體中文" />
  <track kind="subtitles" src="/posts/2026-10/langgraph-resume/captions.ja.vtt" srcLang="ja" label="日本語" />
  Your browser does not support embedded video.
</video>
</figure>

An agent finishes one step. Another step waits for approval. When the second step resumes, the first step runs again.

That failure can be difficult to find. The final graph state can still contain the expected answers. The action history tells a different story.

[LangGraph 1.2.16](https://github.com/langchain-ai/langgraph/releases/tag/1.2.16), released on October 16 at 22:11 UTC, fixes several related resume problems. These affect the software that runs an agent workflow, rather than the model that supplies its answers.

We compared the 1.2.15 and 1.2.16 source runtimes with the same dependencies. The new version passed all 13 selected upstream regression cases. The earlier version passed three. This is a focused regression result, not a general quality score or the full LangGraph test suite.

## Why an approval can expose the bug

LangGraph represents a workflow as connected nodes. An `interrupt()` call pauses a node for input. A checkpointer stores progress, and a thread ID identifies the run to continue.

A nested workflow can contain several parallel branches. Suppose branch A and branch B both pause. A user answers A first, then B. By the second answer, A has finished.

The [subgraph fix, #9315](https://github.com/langchain-ai/langgraph/pull/9315), addresses a case where an ordinary resume was treated as a replay. Saved results were not returned to finished tasks. Those tasks could run again when another branch resumed.

This distinction matters for actions. Repeating a pure calculation wastes time. Repeating a write can create duplicate records or notifications. Our test uses local counters, so it performs no external writes.

An explicit replay of an older checkpoint is different. The fix preserves cases where replay is intentional. Do not interpret it as a rule that completed work can never run again.

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcSet="/posts/2026-10/langgraph-resume/resume-flow.svg" />
  <img src="/posts/2026-10/langgraph-resume/resume-flow-animated.svg" alt="Branches A and B pause. A finishes first. When B resumes, the runtime should reuse A's completed result instead of running A again." width="760" height="1100" style={{width: "100%", height: "auto"}} />
</picture>

## Test the action history and the final state

We ran unmodified test functions from the 1.2.16 source tree against both pinned runtime versions. Both runs used CPython 3.12.14 on Linux and the same dependency environment. Each case received a fresh `InMemorySaver`.

The selected cases include three persistence timings: `sync`, `async`, and `exit`. These control persistence timing, not the choice between `invoke` and `ainvoke`. Nine cases use `invoke` across those settings. A separate invalid-resume case uses `ainvoke`. Other cases cover an explicit latest checkpoint, a nested entrypoint, and an invalid resume response.

| Check | 1.2.15 | 1.2.16 |
| --- | ---: | ---: |
| Selected upstream regression cases | 3 / 13 passed | 13 / 13 passed |
| Model or paid API calls | 0 | 0 |
| Production databases accessed | 0 | 0 |

The selection targets bugs fixed in this release. It cannot estimate the failure rate of an arbitrary application.

Our separate observation probe produced the same final values in both versions: `a:yes` and `b:ok`. Its entry counters exposed the difference.

| Nested workflow observation | 1.2.15 | 1.2.16 |
| --- | ---: | ---: |
| Entries into A | 3 | 2 |
| Entries into B | 3 | 3 |
| Final answer values | `a:yes`, `b:ok` | `a:yes`, `b:ok` |

These counts include invocations that pause. They are not counts of external API writes. We observed the same counts with all three durability settings.

A legitimately resumed node can enter more than once. The regression is A's extra entry after it has finished. A final-value assertion alone misses that difference.

For your own workflow, add a separate event record around each important action. Give the record a run ID, action ID, and attempt number. Then compare the records with the expected execution path.

## A second failure: one update applied twice

The [Command update fix, #9322](https://github.com/langchain-ai/langgraph/pull/9322), concerns a node that pauses more than once. A resume command can carry an answer and a state update.

The earlier implementation could apply that update twice after another interrupt. The underlying problem involved the positions of stored writes. A later save could store the same regular write under a different position.

The patch keeps regular writes in stable positions. Our observation probe collected three answers and three update markers.

With `sync` and `async` durability, 1.2.15 returned `a:123, u1, u1, u2, u3`. Version 1.2.16 returned `a:123, u1, u2, u3`. The saved state matched each returned list. The `exit` setting did not show this particular duplicate in either version.

This is a targeted regression fixture. It is not a recommendation to combine every application update with a resume command. Use the documented input pattern for the operation you need.

The release also includes fixes for repeated pending writes and for other tasks when one resume value is invalid. These cases are represented in our selected tests. We did not test every change in the release.

## The interrupted node still starts again

The [interrupt documentation](https://docs.langchain.com/oss/python/langgraph/interrupts) states an important rule: a resumed node starts from the beginning of its function. It does not continue from a saved instruction inside Python.

We tested that rule with a local event list. Both versions produced `before_interrupt, before_interrupt, after_interrupt`. The second entry is expected restart behavior, not evidence that the patch failed.

Consider a node that first appends an audit entry and then asks for approval. Resuming it can append another entry before the approval value is returned. Moving an effect after the pause can help, but that alone does not handle every later failure or replay.

For an external write, use a stable operation key where the destination supports it. Repeating the same operation should preserve the intended result. This property is called idempotency.

The [Functional API documentation](https://docs.langchain.com/oss/python/langgraph/functional-api) also explains how recorded task results support replay. A task that starts but does not finish can still run again. A checkpoint is not a transaction shared with every external service.

## What to check before deployment

Start with the exact workflow shape that you use. Include nested graphs, parallel approvals, and answers delivered one at a time.

1. Check the final state and the action count.
2. Pause again after a resume to expose accumulated duplicate writes.
3. Test an invalid answer while another branch receives a valid answer.
4. Test the actual checkpoint store and persistence timing.
5. Test interrupted writes with the destination's duplicate-protection mechanism.

Our in-memory tests do not establish database crash recovery, process-restart behavior, distributed execution, or end-to-end agent quality. They do establish the selected runtime regressions under the recorded conditions.

The [experiment bundle](/posts/2026-10/langgraph-resume/langgraph-resume-experiment.zip) includes pinned sources, the runner, dependency versions, results, and reproduction instructions. It contains no credentials or model weights.

For teams that use these resume patterns, the release is a concrete reason to rerun their workflow tests. Keep the action trace beside the final answer. Both are necessary evidence.
