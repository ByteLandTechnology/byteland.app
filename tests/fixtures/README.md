# Test fixtures

`tiny-motion.webm` is a 941-byte, one-second solid-color WebM generated for the media E2E tests. It is test-only and has no production use.

Generate it with:

```sh
ffmpeg -hide_banner -loglevel error -f lavfi -i color=c=0x2878ff:s=16x16:r=10:d=1 -an -c:v libvpx -deadline realtime -cpu-used 8 -b:v 3k -crf 50 -g 10 -f webm -y tests/fixtures/tiny-motion.webm
```

The visibility test overrides `document.hidden` and dispatches `visibilitychange` to exercise the component listener. This does not simulate the operating system actually backgrounding a browser tab.
