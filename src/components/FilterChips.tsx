import { useId, type Ref } from "react";
import { motion } from "framer-motion";
import { useMotionPolicy } from "../hooks/useMotionPolicy";
import { CHIP_SPRING } from "../lib/motion";

export interface ChipOption {
  /** Filter value; null means "show everything". */
  value: string | null;
  label: string;
}

/** Horizontally scrolling filters with an immediate reduced-motion path. */
export default function FilterChips({
  options,
  value,
  onChange,
  layoutId,
  containerRef,
}: {
  options: ChipOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  layoutId?: string;
  containerRef?: Ref<HTMLDivElement>;
}) {
  const { allowMotion } = useMotionPolicy();
  const reactId = useId();
  const indicatorId = layoutId ?? `filter-chip-indicator-${reactId}`;

  return (
    <div
      ref={containerRef}
      data-filter-chips
      className="flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain py-1 -my-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value ?? "__all"}
            type="button"
            onClick={() => {
              if (!active) onChange(option.value);
            }}
            data-filter={option.value ?? "all"}
            aria-pressed={active}
            className={`relative shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rgb-blue focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
              active
                ? "border-transparent text-slate-950 dark:text-white"
                : "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-100/70 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                key={allowMotion ? "animated" : "still"}
                initial={false}
                layoutId={allowMotion ? indicatorId : undefined}
                data-filter-indicator
                transition={allowMotion ? CHIP_SPRING : { duration: 0 }}
                aria-hidden
                className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900"
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
