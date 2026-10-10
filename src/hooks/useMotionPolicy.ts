import { useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Visible, still content on the server and during hydration. This also avoids
// loading decorative media before the browser's preference is known.
const getServerSnapshot = () => true;

export function useMotionPolicy() {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { reducedMotion, allowMotion: !reducedMotion };
}
