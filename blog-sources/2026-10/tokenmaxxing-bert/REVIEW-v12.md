# ByteLand October 17 review · v12

Draft, awaiting explicit approval. Not published.

v12 adds an original plucked/wood-bar closing phrase matching the actual return-to-center logo, wordmark reveal, accelerating spin, and final dot. D5–F#5–A5 recalls the opening tonal family; the contraction resolves A5–F#5–E5–D5. Note timings are in qa/ending-sync-v12.json. The final tone starts at 67.16 s and decays to zero at 67.41 s, before the video end. Narration finishes at 63.547 s; the first new note is at 64.783 s. Actual consecutive ending frames and original per-frame render states were inspected. No subjective listening is claimed.

Opening and page-transition fixes retain the v11 PCM master unchanged before 64.46 seconds. Final AAC is re-encoded, so encoded audio is not bit-identical. Visual H264 stream is copied unchanged. Original synthesized sound, no third-party music recordings.

Run python source/build-v12.py, then python source/validate-v12.py with Python, NumPy and FFmpeg available. Included source/base-v11.wav is the exact recovered v11 PCM master; base-v11.mp4 provides unchanged visual stream. Existing v11 provenance and experiment limitations are retained in prior-review.md.

Static ZIP restores the real v4 Next.js export and updates media references to v12. This is not a new build. No new public URL or browser interaction test.
