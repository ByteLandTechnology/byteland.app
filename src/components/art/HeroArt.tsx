import { Backdrop } from "./Backdrop";
import { GraphGlyph, LayoutGlyph, TinkyGlyph } from "./glyphs";
import { useArt } from "./useArtId";

const CARDS = [
  { Glyph: LayoutGlyph, x: 18, y: 40, float: "0 0;0 -10;0 0", dur: "8s" },
  { Glyph: TinkyGlyph, x: 250, y: 120, float: "0 0;0 12;0 0", dur: "4s" },
  { Glyph: GraphGlyph, x: 70, y: 268, float: "0 0;0 -8;0 0", dur: "8s" },
];

/** Large hero illustration: glowing backdrop with three floating glass cards. */
export default function HeroArt({ className = "" }: { className?: string }) {
  const { prefix, ref } = useArt();
  return (
    <svg
      ref={ref}
      viewBox="0 0 560 460"
      className={`block w-full h-auto ${className}`}
      aria-hidden
    >
      <defs>
        <clipPath id={`${prefix}-panel`}>
          <rect width="560" height="460" rx="28" />
        </clipPath>
        <linearGradient id={`${prefix}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${prefix}-panel)`}>
        <Backdrop id={prefix} width={560} height={460} />
        {CARDS.map(({ Glyph, x, y, float, dur }, i) => (
          <g key={i}>
            <animateTransform
              attributeName="transform"
              type="translate"
              values={float}
              dur={dur}
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              repeatCount="indefinite"
            />
            <g transform={`translate(${x} ${y}) scale(0.72)`}>
              <rect
                width="400"
                height="250"
                rx="26"
                fill="#ffffff"
                fillOpacity="0.07"
                stroke={`url(#${prefix}-stroke)`}
                strokeWidth="1.5"
              />
              <Glyph id={`${prefix}-c${i}`} />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
