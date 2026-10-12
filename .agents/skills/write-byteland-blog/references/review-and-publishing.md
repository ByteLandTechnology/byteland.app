# Review and publishing

Build and render the article using the actual target repository's components in an
isolated cloud copy. A hand-built HTML imitation is not a repository preview. Inspect
the article, images, tables, animations, captions and video at desktop and phone sizes.
Check controls, reduced motion, missing resources, build result and article metadata.
Report what was actually tested and any browser, network, audio or video limitation.

Use an explicitly authorized review channel, such as a restricted static-output
trycloudflare preview or a public Sites review deployment. Expose only necessary
preview output, never .git, credentials, logs, backend endpoints or experiment internals.
Disable preview analytics and state differences from production. Verify the public URL
before sharing it, and disclose that temporary links can be read by anyone who has them.
A preview authorization does not automatically authorize production publication.

Provide a concise Chinese review summary with the English draft/media, verified preview
link, direct sources, experiment summary, terminology/check scope and limitations.
Track selected topic, version/hash, approval and publication status in a suitable local
work record so retries do not duplicate articles or notifications. Never put private
conversation records, credentials or personal information into a public repository.

After explicit approval of the exact version, recheck remote state, current author and
commit identity. Commit only the approved article and necessary resources. Before
pushing, inspect triggered workflows and confirm they respect cost constraints. Do not
force-push or overwrite unrelated work. Verify the resulting remote SHA, build/deployment
and formal article URL before claiming success. If blocked, report the exact missing
condition rather than claiming a check or deployment completed.
