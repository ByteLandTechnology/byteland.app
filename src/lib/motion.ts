export const MOTION = {
  feedback: 0.14,
  reorder: 0.24,
  reveal: 0.32,
  route: 0.32,
  menu: 0.2,
  ease: [0.2, 0, 0, 1] as [number, number, number, number],
};

export const CHIP_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 0.8,
} as const;
