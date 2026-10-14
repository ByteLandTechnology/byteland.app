# Muse Wonder article video sources

Editable sources for the 64.467-second, 1280×720, 60 fps article video.

The video uses the repository’s approved SDF logo and E3/B5 brand animation.
The rendered file uses React SVG, librsvg/Cairo, EGL/Mesa and FFmpeg. It is not a browser Remotion render. Remotion is pinned to 4.0.534; its license and dependency locks are included. Review the applicable license before use.

Extract `muse-wonder-source.zip` before running the source. It is kept outside the web build so the independent Remotion project does not enter Next.js type checking.

## Native reproduction

Inspect the scripts before running them. Install the locked Node dependencies and the packages listed in requirements.txt. The renderer also needs librsvg, Cairo, EGL/Mesa, FFmpeg, DejaVu Sans and Node.js. From this directory:

    mkdir -p qa public
    npm ci --ignore-scripts
    npm run typecheck
    node export.cjs
    python3 render-frames.py
    python3 scripts/build-audio.py
    python3 scripts/master-audio.py
    python3 scripts/render-film.py
    python3 scripts/mux.py

The supplied narration WAV and original effects are the validated audio inputs. The narration script, measured timing, stock-voice provenance, four external caption tracks and license notices are included. The mux script writes the final movie to a sibling deliverables/video directory. No model inference is part of this render.

## Evidence and limits

Sources: https://research.meta.ai/blog/muse-wonder , https://research.meta.ai/static/muse-wonder-model-card , https://dev.meta.ai/docs/overview , https://dev.meta.ai/models/muse-wonder , https://artificialanalysis.ai/models/muse-wonder , https://artificialanalysis.ai/models/muse-wonder-full . Scores and access were checked on October 14, 2026.

The final video decoded successfully. Six scene samples and all five transition boundaries were inspected. Audio measured −17.9 LUFS and −1.5 dBTP. No full playback or listening review was performed. Subtitle translations did not receive a separate native-speaker review.
