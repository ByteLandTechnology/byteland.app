import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { useMotionPolicy } from "../../hooks/useMotionPolicy";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Unique, url()-safe id prefix for SVG <defs>, plus a ref that pauses SMIL
 * animations for visitors who prefer reduced motion.
 */
export function useArt() {
  const prefix = "a" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const { allowMotion, reducedMotion } = useMotionPolicy();

  useIsomorphicLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    // Remotion deterministically pauses/seeks these SVGs on every frame. This
    // hook must never unpause or otherwise take control of that render pass.
    if (svg.closest('[data-smil-mode="manual"]')) return;

    let inView = typeof IntersectionObserver === "undefined";
    let pageVisible = !document.hidden;
    const apply = () => {
      const videoCoversFallback = Boolean(
        svg.closest('[data-motion-overlay="video"]'),
      );
      if (
        reducedMotion ||
        !allowMotion ||
        !inView ||
        !pageVisible ||
        videoCoversFallback
      ) {
        svg.pauseAnimations();
      } else {
        svg.unpauseAnimations();
      }
    };

    // Pause synchronously before the first visible frame when motion is not
    // allowed; the policy hook's SSR default is reduced motion.
    apply();

    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            apply();
          });
    observer?.observe(svg);

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      apply();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // LoopVideo toggles this marker when its video starts covering the SVG.
    // Observe the wrapper instead of coupling the art component to LoopVideo.
    const videoWrapper = svg.closest("[data-video]");
    const mutationObserver = videoWrapper
      ? new MutationObserver(apply)
      : undefined;
    if (videoWrapper) {
      mutationObserver?.observe(videoWrapper, {
        attributes: true,
        attributeFilter: ["data-motion-overlay"],
      });
    }

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [allowMotion, reducedMotion]);

  return { prefix, ref };
}

export const BRAND = {
  blue: "#007aff",
  green: "#34c759",
  red: "#ff3b30",
  ink: "#070b18",
};
