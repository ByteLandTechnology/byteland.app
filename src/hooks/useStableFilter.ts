import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Preserve the filter controls' viewport position while results shrink. */
export function useStableFilter(value: string | null) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const pendingTop = useRef<number | null>(null);

  const restore = useCallback((top: number) => {
    const controls = controlsRef.current;
    const spacer = spacerRef.current;
    if (!controls || !spacer) return;
    // Remove only our previous allowance before measuring natural content.
    spacer.style.height = "0px";
    const documentTop = controls.getBoundingClientRect().top + window.scrollY;
    const targetY = Math.max(0, documentTop - top);
    const naturalHeight = document.documentElement.scrollHeight;
    const allowance = Math.max(
      0,
      Math.ceil(targetY + window.innerHeight - naturalHeight),
    );
    spacer.style.height = `${allowance}px`;
    const requiredHeight = Math.ceil(targetY + window.innerHeight);
    if (document.documentElement.scrollHeight < requiredHeight) {
      // Page's flex-1 main can absorb a small spacer without extending the
      // document. Measure past that free space, then remove the exact excess.
      const probe = allowance + window.innerHeight;
      spacer.style.height = `${probe}px`;
      const excess = document.documentElement.scrollHeight - requiredHeight;
      spacer.style.height = `${Math.max(0, probe - excess)}px`;
    }
    window.scrollTo({
      top: targetY,
      left: window.scrollX,
      behavior: "instant",
    });
  }, []);

  const prepareChange = useCallback(() => {
    pendingTop.current =
      controlsRef.current?.getBoundingClientRect().top ?? null;
  }, []);

  useBrowserLayoutEffect(() => {
    if (pendingTop.current === null) return;
    restore(pendingTop.current);
    pendingTop.current = null;
  }, [value, restore]);

  useEffect(() => {
    const resize = () => {
      const controls = controlsRef.current;
      if (controls) restore(controls.getBoundingClientRect().top);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [restore]);

  return { controlsRef, spacerRef, prepareChange };
}
