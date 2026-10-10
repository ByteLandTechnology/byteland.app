import { BRAND } from "./useArtId";

/**
 * Deep navy panel with three drifting brand-colored glows and a faint grid.
 * Drawn in a 400×250 coordinate space.
 */
export function Backdrop({
  id,
  lead = 0,
  width = 400,
  height = 250,
}: {
  id: string;
  /** Which brand hue sits largest: 0 blue, 1 green, 2 red. */
  lead?: number;
  width?: number;
  height?: number;
}) {
  const colors = [BRAND.blue, BRAND.green, BRAND.red];
  const order = [
    colors[lead % 3],
    colors[(lead + 1) % 3],
    colors[(lead + 2) % 3],
  ];
  const blobs = [
    {
      cx: width * 0.22,
      cy: height * 0.3,
      r: width * 0.42,
      path: "0 0; 30 18; -10 30; 0 0",
      dur: "8s",
    },
    {
      cx: width * 0.82,
      cy: height * 0.25,
      r: width * 0.34,
      path: "0 0; -26 24; -8 -14; 0 0",
      dur: "8s",
    },
    {
      cx: width * 0.6,
      cy: height * 0.95,
      r: width * 0.38,
      path: "0 0; 20 -26; -24 -10; 0 0",
      dur: "8s",
    },
  ];

  return (
    <g>
      <defs>
        {order.map((c, i) => (
          <radialGradient key={i} id={`${id}-glow${i}`}>
            <stop offset="0%" stopColor={c} stopOpacity="0.95" />
            <stop offset="60%" stopColor={c} stopOpacity="0.35" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
        <pattern
          id={`${id}-grid`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={BRAND.ink} />
      {blobs.map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={`url(#${id}-glow${i})`}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values={b.path}
            dur={b.dur}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <rect width={width} height={height} fill={`url(#${id}-grid)`} />
    </g>
  );
}
