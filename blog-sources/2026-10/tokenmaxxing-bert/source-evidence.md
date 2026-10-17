# Research verified October 17, 2026 (UTC)

## Recommendation: Tokenmaxxing BERT announcement, October 15
Official source: https://huggingface.co/blog/huggingface/tokenmaxxing-bert
Author: Simon Brandeis, Hugging Face. This is an optimization announcement, not a stable v1.0 release. The proposed implementation uses SIMD ASCII scanning, 256-code-point caches for Unicode decisions, and deferred allocation/copying. Vendor headline: about 50× over 0.23, combining earlier library work with the proposed optimization. Gains vary by language and size; Chinese and short inputs can regress. Do not equate tokenization acceleration with whole-model or whole-RAG acceleration.

Separate implementation evidence: https://github.com/huggingface/tokenizers/pull/2508
Observed Draft status. Opened October 13; v1.0.0 milestone added October 14. Commits include SIMD ASCII skipping, Unicode caching, rewriter changes, and BERT normalization. This corroborates implementation and unreleased status, not independent performance validation.

Author's reproducibility repository: https://github.com/SBrandeis/tokenmaxxing-bert-reproducer
Downloaded start_jobs.sh pins:
- main fb49a29223724a96f26e061bec8ec7517aa14177
- branch 5b5a3fcc18335eed616ae89adb714a048fed1a31
- release baseline 0.23.2
Local Docker route exists; paid HF Jobs targets must not be run for a free experiment. Raw TSV results and machine metadata are public. Source retrieval worked with urllib even where web parsing failed. No Rust/compiler/Docker in inspected shell. An older wheel does not test optimized throughput.

## Candidate 2: IBM Granite Switch 4.1
Announcement October 15: https://huggingface.co/blog/ibm-granite/granite-switch-4-1
Separate model card gives October 14 release: https://huggingface.co/ibm-granite/granite-switch-4.1-30b
8B and 30B variants combine base model, decision and guardian aLoRAs, and English speech transcription. Primary engineering story: adapter switching and prefix-cache reuse. Both release and announcement dates fall in requested window. Good infrastructure story, but meaningful actual inference requires significant model downloads and hardware; synthetic cache arithmetic would not validate model performance.

## Candidate 3: Meta Muse Spark Open (not Muse Wonder)
Hugging Face launch October 15: https://huggingface.co/blog/meta-muse-spark-open
Separate Meta-authored model card and dated license: https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B
Card explicitly states October 15 release, 816B total/42B active, multimodal input and text output. Gated weights and custom license. This is a genuine in-window announcement, but hardware footprint makes a free local inference experiment impractical here. Lower recommendation than CPU-tokenization story.

## Rejected apparent freshness
Mellum2.1 launch is October 8, per official https://blog.jetbrains.com/category/news/ ; October 14 news recaps do not make it a new release. Apertus 1.5 has earlier weight availability despite fresh October release-notes coverage. Do not use either as a fresh October 14–17 model launch.

## Original offline experiment completed
Script: ../experiment/acceptance_audit.py
Results: ../experiment/acceptance-results.json
Summary: ../experiment/acceptance-summary.json
Runtime: tokenizers 0.23.2, Python 3.12.14. Real official BERT vocabulary (30,522 tokens), downloaded tokenizer JSON saved here; SHA-256 ce64fce797c24f68df90b40a3f74f579b336a493db14bd583fd520ea0d8c9a98.
24 English/code/multilingual/Unicode/control inputs, 128 checks; 126 passed and 2 hypothesis failures deliberately retained. All batch/single ID-and-offset comparisons, all offset-bound/special-token checks, and all 24 input-normalization token-ID invariance checks passed. String-level normalizer idempotence failed for both CJK-containing examples because repeated BERT normalization adds padding spaces again. This is expected behavior, not a library bug.
Important offset findings: decomposed Cafe + combining acute has cafe span (0,4), excluding the removed mark; a + NULL + b becomes ab with span (0,3), including the removed control in original coordinates. Thus normalized-text coordinates cannot substitute for original source coordinates.
This is a baseline compatibility audit and reusable golden snapshot, NOT a cross-version differential test, optimized speed benchmark, model-quality result, or representative multilingual performance evaluation. A future optimized build should consume the exact same tokenizer file and input cases and compare IDs, offsets, masks, and slices against these saved records. Timing should remain separate and stratified by script/length.

## Additional independent technical foundations checked
- Google BERT original implementation: https://github.com/google-research/bert/blob/master/tokenization.py . Explains BERT-specific cleaning, CJK boundaries, case and accent handling. Historical foundation, not an October 2026 announcement.
- Unicode Consortium UAX #15: https://www.unicode.org/reports/tr15/ . Canonical and compatibility normalization distinctions. Does not define the extra BERT pipeline steps.
- Versioned Encoding reference: https://huggingface.co/docs/tokenizers/v0.20.3/en/api/encoding . Documents original-string offsets. Our actual runtime baseline is 0.23.2, not 0.20.3.
- Current prerelease reference: https://huggingface.co/docs/tokenizers/api/encoding . On review it states offsets and other APIs are not yet available in rc0 bindings. Current docs are a moving target; this is a rollout caveat, not a claim about every future RC.

The announcement, PR and reproducer share a maintainer/source lineage. They are corroborating primary records, not independent replications of the performance result. Google and Unicode provide independent foundations; they do not validate the proposed speedup.
