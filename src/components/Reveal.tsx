import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { useRevealMotion } from "../hooks/useRevealMotion";

type Props = Omit<
  HTMLAttributes<HTMLElement>,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  as?: "div" | "li" | "p" | "h1";
  delay?: number;
};

export default function Reveal({ as = "div", delay = 0, ...props }: Props) {
  const reveal = useRevealMotion(delay);
  const Element = motion[as];
  return <Element {...props} {...reveal} />;
}
