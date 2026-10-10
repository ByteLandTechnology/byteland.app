import { ReactNode, useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Renders the site's SMIL-animated SVGs at the current video frame: every
 * <svg> inside is paused and seeked, so each frame is deterministic.
 */
export function Seek({ children }: { children: ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current?.querySelectorAll("svg").forEach((svg) => {
      if (svg.ownerSVGElement) return; // only outermost <svg> elements
      svg.pauseAnimations();
      svg.setCurrentTime(frame / fps);
    });
  }, [frame, fps]);

  return (
    <AbsoluteFill ref={ref} data-smil-mode="manual">
      {children}
    </AbsoluteFill>
  );
}
