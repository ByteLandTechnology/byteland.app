# LFM2.5-24B-A2B: what local agents really need

Editable video source, 2026-10-15.

## Contents

The source produces an 80.4667-second, 1280 × 720, 60 fps film with six sections,
English narration, original synthesized effects and external English, Simplified
Chinese, Traditional Chinese and Japanese captions. Each caption track has 17 cues.

The video separates active computation from model size, published weight-file size
from runtime RAM, decoding from aggregate throughput and task completion, and vendor
benchmarks from independent evidence. It also explains the harness, external-tool
data paths and deployment choices. No LFM inference, hardware speed test, RAM
measurement or independent benchmark replication was performed for this article.

The archive includes the React/Remotion composition, analytical SDF branding, E3
wordmark and B5 motion sources, narration stem and script, timing, caption translations,
sound synthesis, dependency locks, licenses and compact validation results. Scene,
narration and caption content is unchanged from the accompanying video.

## Rendering method

The film was rendered natively: React Frame components were exported to SVG,
rasterized with librsvg/Cairo, composited with the analytical GLSL SDF through
EGL/Mesa llvmpipe, and encoded with FFmpeg. It was not rendered by a browser-based
Remotion renderer. The native route is the documented reproduction method.

The single corner logo rotates continuously across chapters. Three content containers
connect the parameter cards, memory budget, throughput streams, benchmark rows, tool
path and decision checklist. Benchmark numerals exit before harness labels enter.
Stream motion is schematic and does not encode measured performance.

## Rebuild with the included narration

Use a compatible Linux environment with Node, Python, FFmpeg, librsvg, Cairo, EGL,
Mesa GLES 3 and DejaVu Sans. The original render used Node 24.19.0, Python 3.12.14,
FFmpeg 7.1.5, NumPy 2.3.5 and Pillow 12.3.0. Fonts and renderer versions can affect
layout or encoding. Inspect scripts before execution.

From the extracted video-liquid folder:

```sh
npm ci --ignore-scripts --cache ../npm-cache
python3 -m pip install -r requirements.txt
node build-brand.cjs
npm run typecheck
python3 scripts/build-audio.py
python3 scripts/master-audio.py
python3 scripts/build-captions.py
node export.cjs
python3 render-frames.py
python3 scripts/render-film.py
python3 scripts/mux.py
python3 scripts/validate-film.py
```

Output: ../deliverables/video/lfm25-local-agents-v1.mp4.
The validation script extracts encoded frames for visual inspection; extraction alone
is not visual approval. Temporary frame files can use several hundred MB.

The included narration avoids any need for fresh speech synthesis. For fresh synthesis,
create a separate environment with audio/narration-requirements.txt and the documented
Kokoro model and voice bank. Set KOKORO_MODEL_DIR to their directory, then run
scripts/generate-narration.py and scripts/validate-narration.py in that environment.
Synthesis caches use the package-local tts folder. Clip paths in metadata are relative
to the package. The path-only portability changes did not regenerate the included audio.

## Validation and limits

The 4,828-frame video and audio decoded successfully. Type checking, narration sample
counts, clipping checks and caption timing checks passed. Encoded frames before,
during and after all five chapter boundaries, stable scenes and brand bookends were
inspected. This was sampled frame inspection, not full playback or auditory review.

Final AAC audio measured −17.9 LUFS integrated, 2.7 LU loudness range and −1.4 dBTP.
The stock Kokoro af_heart narration was generated sentence by sentence. Captions follow
measured clip sample counts. There was no auditory listening or independent ASR check;
translations have no separate native-speaker review. See qa/validation.json and
audio/narration-validation.json for the recorded results.

## Sources

- [Liquid launch and vendor benchmark conditions](https://www.liquid.ai/blog/lfm2-5-24b-a2b)
- [Official model card](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B)
- [Official GGUF file listing](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B-GGUF/tree/main)
- [Harness guidance](https://docs.liquid.ai/examples/agent-harnesses)
- [LFM model license](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B/blob/main/LICENSE)

Claims and interpretation are mapped in qa/source-map.json. The stream and harness
illustrations are explanatory diagrams, not a recorded model test. Commercial users
should inspect the LFM license; the video does not make a blanket permission claim.

## Licenses

ByteLand source follows the included repository CC BY-NC-SA 4.0 license. The E3
outlines use Exo 2 under SIL OFL. DejaVu notices and the installed Remotion 4.0.534
license are included. Remotion packages are pinned and their installed license hashes
were checked; review [the applicable terms](https://www.remotion.dev/license) for your
own use. Narration model, stock voice and runtime provenance is documented in
audio/NARRATION-PROVENANCE.md, with notices in audio/narration-licenses.

No model weights, package environments, render caches, frame dumps or production logs
are included. No third-party music or footage is used.

[Download the editable source archive](./lfm25-local-agents-source.zip).
