---
title: "Transformers 5.20.2: Keep the Object When You Move the Tensor"
date: "2026-10-20"
description: "A device-transfer helper kept tensor data but erased ModelOutput behavior. We reproduce the failure and the fix with tiny BART and LLaVA models on CPU."
tags: [AI]
author: "The ByteLand Team"
image: "./transformers-types/cover.svg"
draft: false
---

<figure style={{margin: "0 0 32px"}}>
<video controls playsInline preload="metadata" aria-label="Transformers container type regression and CPU test results" poster="/posts/2026-10/transformers-types/poster.jpg" style={{display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", borderRadius: "16px"}}>
  <source src="/posts/2026-10/transformers-types/transformers-types-v1.mp4" type="video/mp4" />
  <track kind="subtitles" src="/posts/2026-10/transformers-types/captions.en.vtt" srcLang="en" label="English" default />
  <track kind="subtitles" src="/posts/2026-10/transformers-types/captions.zh-Hans.vtt" srcLang="zh-Hans" label="简体中文" />
  <track kind="subtitles" src="/posts/2026-10/transformers-types/captions.zh-Hant.vtt" srcLang="zh-Hant" label="繁體中文" />
  <track kind="subtitles" src="/posts/2026-10/transformers-types/captions.ja.vtt" srcLang="ja" label="日本語" />
  Your browser does not support embedded video.
</video>
</figure>

A tensor can keep its values while the object around it loses its behavior. In a generation pipeline, that can stop the next model call.

[Transformers 5.20.2](https://github.com/huggingface/transformers/releases/tag/v5.20.2), released on October 19, fixes one such failure. A helper that moves tensors between devices converted dictionary subclasses into plain dictionaries. This removed the interface that later code expected.

We compared the 5.20.1 and 5.20.2 source runtimes with the same dependencies. Two tiny models failed on the affected branch before the patch. Both generated tokens after it. Their normal CPU controls passed in both versions.

This is a library regression test. The models use random weights, and the test forces a device-check branch on CPU. It does not measure model quality or verify a GPU transfer.

## A model output is more than a dictionary

Transformers returns many results as `ModelOutput` subclasses. These objects offer named attributes and dictionary-like access. They also support integer or slice access to their non-empty fields. The [model output documentation](https://huggingface.co/docs/transformers/main/en/main_classes/output) describes this interface.

For example, `BaseModelOutput` can hold a tensor in `last_hidden_state`. Code can use `result.last_hidden_state` to read it. A plain dictionary with the same key requires `result["last_hidden_state"]` instead.

Those expressions are not interchangeable. A tensor-value assertion can pass even when attribute access fails.

Generation can carry such objects inside another dictionary. A vision-language model can retain image-encoder results for later decoding steps. A recursive device-transfer helper must preserve the structures that those steps consume.

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcSet="/posts/2026-10/transformers-types/type-flow.svg" />
  <img src="/posts/2026-10/transformers-types/type-flow-animated.svg" alt="A ModelOutput contains a tensor. The old transfer helper returns a plain dictionary and attribute access fails. The patched helper preserves ModelOutput and attribute access succeeds." width="760" height="960" style={{width: "100%", height: "auto"}} />
</picture>

## Where the type disappeared

The earlier helper rebuilt every dictionary with a dictionary comprehension. This produced a plain `dict`, even when the input used a subclass.

The [patch in pull request #49731](https://github.com/huggingface/transformers/pull/49731) changes that reconstruction step. It calls the original container class with the moved entries. The tensor, list, and tuple branches remain separate.

The following code shows the changed dictionary branch:

```python
# Earlier branch
return {k: move_to_device(v, device) for k, v in value.items()}

# Patched branch
return type(value)({k: move_to_device(v, device) for k, v in value.items()})
```

This preserves `BaseModelOutput` for the case we tested. Its nested tuple also survives. The change repairs an interface contract; it does not change the model weights or add a reasoning capability.

The [earlier device-placement change, #49317](https://github.com/huggingface/transformers/pull/49317), introduced recursive movement for inputs in generation. The regression report arrived on October 17. The fix merged on October 19, before the 5.20.2 patch release.

Device placement and typed model outputs are established concepts. The new event is this specific repair.

## Reproduce the branch without a GPU

We used CPython 3.12.14, PyTorch 2.14.1+cpu, and one CPU thread. Both Transformers versions ran in separate processes with the same dependency environment.

The fixture creates a small BART model and a small LLaVA model from configuration. They contain 8,768 and 8,352 parameters respectively. No trained weights, images, or tokenizer files are downloaded. The image input is a random tensor.

First, each model runs on its ordinary CPU path. Then the fixture temporarily changes the reported model device to `cpu:0`. The input tensor still reports `cpu`. Their comparison selects the transfer branch, while computation stays on CPU.

The [upstream issue #49699](https://github.com/huggingface/transformers/issues/49699) documents this technique. Our harness uses a scoped patch that restores the property after the check.

| Generation check | 5.20.1 | 5.20.2 |
| --- | --- | --- |
| BART, normal CPU path | Output shape `[1, 4]` | Output shape `[1, 4]` |
| LLaVA, normal CPU path | Output shape `[1, 11]` | Output shape `[1, 11]` |
| BART, forced transfer branch | `KeyError: 0` | Output shape `[1, 4]` |
| LLaVA, forced transfer branch | Missing `pooler_output` attribute | Output shape `[1, 11]` |

These are observed results from our runs. Each shape describes the returned token tensor, not an accuracy score. The calls request three new tokens with sampling disabled.

We also ran the unmodified targeted test method added by the upstream patch. It failed against 5.20.1 and passed against 5.20.2. That method checks recursive calls, output types, and preparation of generation inputs. We did not run the complete Transformers test suite.

The difference between the two paths is useful evidence. A test that only calls the model with inputs already on the expected device can miss this regression.

## Test the container boundary too

Our helper checks covered `BaseModelOutput`, a nested model output, `OrderedDict`, an ordinary dictionary, and a tuple of tensors. The patch preserved the expected types in these cases. The ordinary dictionary and tuple controls already passed in 5.20.1.

A separate negative case used `defaultdict`. Version 5.20.1 converted it to a plain dictionary. Version 5.20.2 raised `TypeError` because the constructor expected a callable default factory as its first argument.

That result defines a limit of this reconstruction pattern. It is not evidence that a documented Transformers input must accept `defaultdict`. It does show why the patch should not be described as support for every mapping class.

If your extension passes custom containers, test those exact types. Do not assume that `type(value)(entries)` is a general serialization protocol. Some constructors need additional arguments or preserve extra state.

## Add assertions at the interface

For a device-transfer test, check more than completion:

1. Check the output class.
2. Read a required attribute or indexed field.
3. Check nested container types.
4. Check tensor values, shapes, and devices.
5. Exercise the normal path and the transfer branch.
6. Test unsupported containers separately.

Keep the expected failure cases visible. A report that combines every case into one pass percentage can hide the difference between a repaired regression and an unsupported input.

Our forced-branch test does not establish GPU correctness, multi-device placement, distributed execution, or speed. It also does not assess the other fixes in 5.20.2. Test your actual model, device layout, cache configuration, and dependency set before deployment.

The [experiment bundle](/posts/2026-10/transformers-types/transformers-types-experiment.zip) includes the harness, pinned source references, recorded dependencies, raw results, and reproduction commands. The bundled checks make no model-service calls.

For an application affected by this path, the patch provides a concrete regression target. Preserve the tensor data and the interface that the next step needs.
