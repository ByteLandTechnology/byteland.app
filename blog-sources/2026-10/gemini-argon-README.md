# Gemini 4 Argon article video sources

Editable source for the 74.467-second, 1280×720, 60 fps article video. Extract gemini-argon-source.zip and work in video-argon. This independent project is archived outside the Next.js source tree.

The native renderer uses React SVG, librsvg/Cairo, EGL/Mesa and FFmpeg. This is not a browser Remotion render. Remotion is pinned to 4.0.534; review its included license before use. Narration is supplied as audio with stock-voice provenance and license notices. No model inference is required to rebuild the supplied film.

Inspect scripts, then install locked Node dependencies and the Python requirements. System dependencies include librsvg, Cairo, EGL/Mesa, FFmpeg and DejaVu Sans.

    mkdir -p qa public
    npm ci --ignore-scripts
    node build-brand.cjs
    npm run typecheck
    node export.cjs
    python3 render-frames.py
    python3 scripts/build-audio.py
    python3 scripts/master-audio.py
    python3 scripts/build-captions.py
    python3 scripts/render-film.py
    python3 scripts/mux.py

The brand data must be generated before type checking. The mux script writes to a sibling deliverables/video directory. Source includes approved SDF/E3/B5 geometry, narration, effects, four caption tracks, timing and dependency licenses. Logs, caches, rendered frame dumps and duplicate sentence audio are omitted.

Evidence is attributed in the article and source-map references in the source README. The film decoded successfully and scene/transition samples were inspected. Audio measured −17.9 LUFS and −1.5 dBTP. No full perceptual listening test or separate native-speaker translation review is claimed.
