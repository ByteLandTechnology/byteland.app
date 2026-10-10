import { useCallback, useEffect, useRef } from "react";
import { useAnimationControls, type MotionProps } from "framer-motion";
import { useMotionPolicy } from "./useMotionPolicy";
import { MOTION } from "../lib/motion";

/** Content is visible in server HTML. Only first viewport entry may move it. */
export function useRevealMotion(
  delay = 0,
): MotionProps & { ref: (element: HTMLElement | null) => void } {
  const { allowMotion } = useMotionPolicy();
  const controls = useAnimationControls();
  const entered = useRef(false);
  const ref = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    // Already-visible server content must not jump down and replay on hydration.
    if (bounds.top < window.innerHeight && bounds.bottom > 0)
      entered.current = true;
  }, []);

  useEffect(() => {
    if (!allowMotion) {
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [allowMotion, controls]);

  const onViewportEnter = useCallback(() => {
    if (entered.current) return;
    entered.current = true;
    // Shared page snapshots already provide the entrance. Do not replay it
    // after hydration or after the route transition finishes.
    if (
      !allowMotion ||
      document.documentElement.dataset.viewTransition === "active"
    )
      return;
    void controls.start({
      y: [16, 0],
      transition: {
        duration: MOTION.reveal,
        delay: Math.min(delay, 0.16),
        ease: MOTION.ease,
      },
    });
  }, [allowMotion, controls, delay]);

  return {
    ref,
    initial: false,
    animate: controls,
    viewport: { once: true },
    onViewportEnter,
  };
}
