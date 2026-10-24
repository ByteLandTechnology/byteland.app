---
title: "llm-d 1.0: Keep Agent Traffic Moving"
date: "2026-10-22"
description: "Separate queues, reuse prompt context, and coordinate serving pools. A practical guide to the operating choices in llm-d 1.0."
tags: [AI, AI Agents]
author: "The ByteLand Team"
image: "./llm-d-1-0-agent-serving/llmd-overview-r3.svg"
draft: false
---

<figure style={{margin: "0 0 32px"}}>
<video controls playsInline preload="metadata" aria-label="How llm-d coordinates queue admission, cache-aware routing, and compatible serving revisions" poster="/posts/2026-10/llm-d-1-0-agent-serving/llmd-service-r3-poster.png" style={{display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", borderRadius: "16px"}}>
<source src="/posts/2026-10/llm-d-1-0-agent-serving/llmd-service-full-v3.mp4" type="video/mp4" />
<track kind="subtitles" src="/posts/2026-10/llm-d-1-0-agent-serving/llmd-service-full-v3.en.vtt" srcLang="en" label="English" default />
<track kind="subtitles" src="/posts/2026-10/llm-d-1-0-agent-serving/llmd-service-full-v3.zh-Hans.vtt" srcLang="zh-Hans" label="简体中文" />
<track kind="subtitles" src="/posts/2026-10/llm-d-1-0-agent-serving/llmd-service-full-v3.zh-Hant.vtt" srcLang="zh-Hant" label="繁體中文" />
<track kind="subtitles" src="/posts/2026-10/llm-d-1-0-agent-serving/llmd-service-full-v3.ja.vtt" srcLang="ja" label="日本語" />
</video>
<figcaption style={{marginTop: "12px", fontSize: "0.9rem", lineHeight: "1.5"}}>Follow one service through three decisions: when to admit work, where to send it, and how to keep its processing phases compatible during an upgrade. The examples illustrate operating choices, not measured serving speed.</figcaption>
</figure>

A fast model does not guarantee a responsive service. One agent can send a series of long requests. Another user may need a short answer now. Both requests reach the same machines, but they do not have the same needs.

On 20 October 2026, the llm-d project announced version 1.0. It is a distributed inference stack that works with model servers such as vLLM and SGLang. It does not replace the model or turn every workload into a faster one. Its purpose is to coordinate the service around those servers. [Source 1](https://llm-d.ai/blog/llm-d-v1.0-state-of-the-art-inference-ready-for-day-2) [Source 3](https://research.ibm.com/blog/llmd-1-0-is-ready-for-production-inference-serving)

The important change is operational. Earlier releases already included prefix-aware routing, cache offload, and separate prefill and decode pools. Version 1.0 adds a stable configuration API and stronger controls for shared traffic, upgrades, and agent sessions. [Source 1](https://llm-d.ai/blog/llm-d-v1.0-state-of-the-art-inference-ready-for-day-2)

## A queue is part of the service

Consider a shared service with two kinds of work. People ask short, interactive questions. Background agents inspect large codebases. The agents can submit several requests at once.

A simple queue treats arrival order as the main rule. That rule is easy to understand. It cannot express every service promise, however. A background burst can compete with the next interactive request.

In llm-d 1.0, flow control can group requests by tenant or workload and by priority. It maintains separate queues. It selects by priority, then shares turns among tenants in the same priority band. When servers are full, the router can hold requests instead of adding them to overloaded server queues. [Source 1](https://llm-d.ai/blog/llm-d-v1.0-state-of-the-art-inference-ready-for-day-2)

This policy is not automatic. The defaults still resemble first-come, first-served operation. Operators must configure the multi-tenant policy. Priority also cannot create capacity. Teams still need to decide which work can wait, which work can be refused, and what delay is acceptable.

<picture>
<source media="(prefers-reduced-motion: reduce)" srcSet="/posts/2026-10/llm-d-1-0-agent-serving/llmd-flow-control-r3-static.svg" />
<img src="/posts/2026-10/llm-d-1-0-agent-serving/llmd-flow-control-r3.svg" alt="Request X1 finishes and frees a serving slot. Request A1 enters that slot while B1 remains visibly queued." width="1280" height="720" style={{width: "100%", height: "auto"}} />
</picture>

## Send context where it can be reused

An agent often returns to the same conversation. Its next request can share a long prefix with the previous request. Sending that request to a server with the relevant cached state can avoid repeated prompt work.

Google describes llm-d as a coordinated pool behind one endpoint. Its router considers cached prefixes as well as load. Cache can also move through different memory tiers, rather than remain only in accelerator memory. [Source 2](https://cloud.google.com/blog/topics/ai-infrastructure/llm-d-1-0-an-open-source-stack-for-distributed-inference)

The useful mental model is a workshop with several benches. A worker benefits from returning to the bench that holds the current job. But a crowded bench is not always the best choice. This analogy describes a trade-off, not an exact scheduling algorithm.

Do not confuse cache reuse with permanent conversation storage. Cache is an execution resource. Application records, access rules, and retention policies still need their own design.

## Separate the phases without splitting responsibility

Prefill processes the input prompt. Decode generates the output tokens. These phases place different demands on hardware. A disaggregated deployment assigns them to separate pools so that each pool can scale for its work. [Source 2](https://cloud.google.com/blog/topics/ai-infrastructure/llm-d-1-0-an-open-source-stack-for-distributed-inference)

That separation creates an operational question: how do the pools change version together?

A version change can make the two phases incompatible. DisaggregatedSet labels the components by revision. With the rollout screener configured, routing selects one revision for a request and keeps both phases within it. A new revision receives no traffic until every required role has a Ready pod. [Revision-gating guide](https://lws.sigs.k8s.io/docs/concepts/disaggregatedset/llm-d-integration/)

This needs explicit setup. The current [llm-d rollout guide](https://llm-d.ai/docs/operations/disaggregation/safe-rollouts) marks the screener **Alpha**. It requires `allow-experimental-plugins: true`, LeaderWorkerSet 0.11.1 or later with DisaggregatedSet enabled, and correct router configuration. Installing the controller alone does not enable revision-aware routing.

Graceful drain also matters. A prefill component can still hold state that an active decode request needs. The guide requires shutdown settings that allow requests and dependent cache transfers to finish. Revision selection does not replace that step.

These controls address a specific coordination risk. They are not a guarantee that every upgrade or failure is safe. Check the documented prerequisites and your serving-engine versions before use.

Our diagram shows one request moving through both phases. It is a conceptual example, not a benchmark. The important detail is continuity: the request must reach compatible components throughout its path.

![One request moves from prefill to decode while remaining part of the same service.](/posts/2026-10/llm-d-1-0-agent-serving/llmd-phases.svg)

## Choose an operating policy, not a headline number

IBM frames the release around “day 2” operations: keeping a service useful after its first successful deployment. It connects inference engines with the routing and operational controls needed for shared infrastructure. [Source 3](https://research.ibm.com/blog/llmd-1-0-is-ready-for-production-inference-serving)

For a small team, that does not mean every application needs a distributed cluster. Start with a concrete problem. Is repeated context expensive? Are background jobs delaying users? Are split-pool upgrades difficult to coordinate?

| Problem | Relevant control | Decision to make |
|---|---|---|
| Bursty shared traffic | Flow control | Who can wait? |
| Repeated prompt context | Cache-aware routing | When should load outweigh locality? |
| Split serving phases | Coordinated updates | Which component versions can work together? |

llm-d 1.0 makes these operating decisions more explicit. The gain is not a universal speed promise. It is a clearer way to control how a shared inference service behaves.

## Sources

1. [llm-d maintainers: version 1.0 announcement, 20 October 2026](https://llm-d.ai/blog/llm-d-v1.0-state-of-the-art-inference-ready-for-day-2)
2. [Google Cloud: llm-d 1.0 distributed inference, 20 October 2026](https://cloud.google.com/blog/topics/ai-infrastructure/llm-d-1-0-an-open-source-stack-for-distributed-inference)
3. [IBM Research: llm-d 1.0 and production operations, 20 October 2026](https://research.ibm.com/blog/llmd-1-0-is-ready-for-production-inference-serving)

4. [llm-d: safe rollouts of disaggregated deployments, v1.0 guide](https://llm-d.ai/docs/operations/disaggregation/safe-rollouts)
5. [LeaderWorkerSet: revision gating with llm-d, updated 20 October 2026](https://lws.sigs.k8s.io/docs/concepts/disaggregatedset/llm-d-integration/)
