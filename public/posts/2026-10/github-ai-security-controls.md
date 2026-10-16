---
title: "GitHub's AI Security Upgrades: Three Controls, Three Different Jobs"
date: "2026-10-16"
description: "AI Scan finds possible risks, agentic autofix proposes repairs, and workflow lockfiles control what runs. Their boundaries matter as much as their capabilities."
tags: [AI, AI Agents, GitHub, Security]
author: "The ByteLand Team"
image: "./github-ai-security-controls/cover.svg"
draft: false
---

<figure style={{margin: "0 0 32px"}}>
<video controls playsInline preload="metadata" aria-label="GitHub AI security: detection, repair, and execution controls" poster="/posts/2026-10/github-ai-security-controls/poster.jpg" style={{display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", borderRadius: "16px"}}>
  <source src="/posts/2026-10/github-ai-security-controls/github-ai-security-controls-v1.mp4" type="video/mp4" />
  <track kind="subtitles" src="/posts/2026-10/github-ai-security-controls/captions.en.vtt" srcLang="en" label="English" default />
  <track kind="subtitles" src="/posts/2026-10/github-ai-security-controls/captions.zh-Hans.vtt" srcLang="zh-Hans" label="简体中文" />
  <track kind="subtitles" src="/posts/2026-10/github-ai-security-controls/captions.zh-Hant.vtt" srcLang="zh-Hant" label="繁體中文" />
  <track kind="subtitles" src="/posts/2026-10/github-ai-security-controls/captions.ja.vtt" srcLang="ja" label="日本語" />
  Your browser does not support embedded video. <a href="/posts/2026-10/github-ai-security-controls/github-ai-security-controls-v1.mp4">Download the video</a>.
</video>
</figure>

A security finding, a proposed patch, and a controlled build answer different questions. GitHub's latest releases make that distinction worth revisiting.

On October 15, GitHub made [AI Scan for pull requests](https://github.blog/changelog/2026-10-15-ai-scan-for-pull-requests-generally-available/) and [agentic autofix](https://github.blog/changelog/2026-10-15-agentic-autofix-for-code-scanning-alerts-general-availability/) generally available. A day earlier, [workflow dependency lockfiles](https://github.blog/changelog/2026-10-14-github-actions-workflow-lockfiles-in-public-preview/) entered public preview. Together, they suggest a useful design: let AI identify and investigate problems, then keep explicit controls around changes and execution.

They are separate features. In particular, a new AI Scan finding does not automatically become an agentic autofix task.

## AI Scan adds a signal, not a merge gate

AI Scan examines pull request (PR) changes in areas beyond CodeQL's current coverage. GitHub lists PHP, Shell/Bash, Terraform HCL, Dockerfiles, JSP, and Blazor among the supported examples. Findings appear with an AI label and may include a proposed remedy. See the [AI Scan launch details](https://github.blog/changelog/2026-10-15-ai-scan-for-pull-requests-generally-available/).

The operational limit is important: these findings are advisory. They do not fail the code-scanning check and cannot enforce a merge block through rulesets. Scans also exclude fork pull requests and Dependabot pull requests. They do not scan the full repository or create backlog alerts.

For a team that accepts outside contributions, this changes how to interpret a quiet pull request. No AI finding can mean that the change was outside the feature's scope. It does not establish that the change is safe.

Keep required checks and human review in place. Ask reviewers to distinguish three states: scanned with no findings, scanned with findings, and not scanned. Treating all three as a green result would hide a coverage gap.

## Agentic autofix starts from a different place

[Agentic autofix](https://github.blog/changelog/2026-10-15-agentic-autofix-for-code-scanning-alerts-general-availability/) works on code-scanning alerts from the repository's default branch. Alerts found only on a pull request or another branch cannot be assigned to it.

After assignment, Copilot examines relevant files, proposes a change, runs validation, and can iterate. It then opens a draft pull request. Teams can select up to 25 alerts for one pull request. Each session uses Code Security AI Credits and GitHub Actions minutes.

That is useful automation, but the draft pull request remains a proposal. A smaller alert count does not tell you whether application behavior stayed correct.

GitHub's [autofix documentation](https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/code-scanning/autofix-for-code-scanning) describes validation as best effort. The agent reruns CodeQL with the code-scanning query suite. It cannot confirm fixes for custom CodeQL queries, the security-extended suite, or third-party scanner alerts.

Review the exact validation reported in each pull request. For an access-control fix, for example, check that authorized users still succeed and unauthorized users still fail. A scanner result and a behavior test answer different questions.

Do not confuse agentic autofix with conventional Copilot Autofix. The latter supplies a suggested change for review and does not consume AI Credits. The two experiences have different access and enablement requirements.

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcSet="/posts/2026-10/github-ai-security-controls/security-controls.svg" />
  <img src="/posts/2026-10/github-ai-security-controls/security-controls-animated.svg" alt="Three independent controls: AI Scan advises on eligible pull requests; agentic autofix proposes repairs for default-branch alerts; workflow lockfiles select dependency commits." width="700" height="1000" style={{width: "100%", height: "auto"}} />
</picture>

## Lockfiles control the code that executes

The [October 14 preview](https://github.blog/changelog/2026-10-14-github-actions-workflow-lockfiles-in-public-preview/) addresses a different failure mode. An action tag can move after review. A later workflow run can therefore execute a different commit without any change to your workflow file.

GitHub's `gh actions-lock` extension creates `.github/workflows/actions.lock`. Workflows added to the lockfile run the recorded commits even when upstream tags move. Administrators can require lockfiles, and Dependabot can update matching entries with action-version changes.

The [lockfile documentation](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles) defines the boundary. Coverage includes transitive action dependencies. A called reusable workflow's dependencies belong to the lockfile in the repository that defines that workflow. The file also records numeric repository and owner identities for runtime checks. Generate it with the extension; do not compose it by hand.

We inspected ByteLand's [deployment workflow at commit 75482ba](https://github.com/ByteLandTechnology/byteland.app/blob/75482bafd287e5ff637cb851213e4d39b06a3601/.github/workflows/deploy.yml). It uses tag references for checkout, Node setup, cache, and Pages deployment, and the repository has no Actions lockfile. That makes dependency review a concrete next step for our own site. We did not change the workflow or enable a GitHub service for this article.

A lockfile fixes dependency identity, not dependency quality. Review the selected commit before accepting it. Also keep a process for updates, because preserving an old vulnerable commit is still preserving a vulnerability.

## What each result actually establishes

| Control | Useful result | What still needs attention |
| --- | --- | --- |
| AI Scan | A possible security problem in an eligible PR change | Coverage gaps, false positives, and merge policy |
| Agentic autofix | A proposed patch with recorded validation | Supported validation scope and application behavior |
| Workflow lockfile | A recorded dependency commit for execution | Whether that commit is trustworthy and maintained |

Independent research reinforces the last distinction. In an [October 14 study](https://blog.trailofbits.com/2026/10/14/package-managers-have-an-integrity-problem/), Trail of Bits tested 25 package managers against a simulated compromised repository. Verification behavior varied, and a lockfile's presence did not always imply integrity enforcement. These were package-manager tests, not a test of GitHub's new Actions lockfiles. The relevant lesson is to check what the runtime actually verifies.

## Start with a small initial rollout

Our recommendation is to start with one repository and a named review owner. Record which changes are eligible for scanning and which checks must pass before merge. Keep a small set of known behavior tests beside the security check.

Set the budget before enabling AI Scan across an organization. GitHub's [billing and enablement guidance](https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/code-scanning/ai-powered-security-detections) says eligible repositories can start consuming credits immediately. A hard budget can also prevent new findings. Missing results therefore need an explanation, including coverage and budget state.

For agentic repairs, measure reviewer time, accepted fixes, regressions, and total cost. For lockfiles, review changes to dependency commits as code changes. Those measurements are more useful than counting how many suggestions an agent produced.

We have not run the hosted scanning or repair features, measured their detection quality, or reproduced their validation behavior. The feature descriptions above come from GitHub's current documentation; the workflow inspection is our own. The rollout plan is our engineering recommendation.

## Conclusion

These releases can reduce the work between finding a risk and reviewing a repair. Their value depends on clear boundaries: an advisory finding informs review, a generated patch needs verification, and a lockfile controls which dependency commits run. Use each for its specific job, and keep responsibility for the final change explicit.
