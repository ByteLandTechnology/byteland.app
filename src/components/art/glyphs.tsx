/**
 * Project glyphs drawn in white/glass over a Backdrop, in a 400×250 space.
 *
 * Animations are SMIL so they also run without JS, and every duration
 * divides 8s: the Remotion videos in /video seek these same SVGs frame by
 * frame and loop them every 8 seconds.
 */
import { BRAND } from "./useArtId";

const ease = (n: number) => Array(n).fill("0.65 0 0.35 1").join(";");
const MONO = "JetBrains Mono, ui-monospace, monospace";

/** keyTimes from seconds on an 8s timeline. */
const kt = (secs: number[]) => secs.map((s) => +(s / 8).toFixed(4)).join(";");

function FrameGradient({ id }: { id: string }) {
  return (
    <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={BRAND.blue} />
      <stop offset="0.5" stopColor={BRAND.green} />
      <stop offset="1" stopColor={BRAND.red} />
    </linearGradient>
  );
}

function Terminal({
  id,
  x,
  y,
  w,
  h,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill="#0b1124"
        fillOpacity="0.88"
        stroke={`url(#${id}-frame)`}
        strokeWidth="2.5"
      />
      {[BRAND.red, "#ffcc00", BRAND.green].map((c, i) => (
        <circle key={c} cx={x + 20 + i * 14} cy={y + 18} r="4.5" fill={c} />
      ))}
    </g>
  );
}

/* ---------- taffy-layout: tiles reflow between row, grid and app shell ---------- */

type Box = [number, number, number, number];
const LAYOUT_STATES: Box[][] = [
  [
    [76, 61, 54, 128],
    [140, 61, 54, 128],
    [204, 61, 54, 128],
    [268, 61, 56, 128],
  ],
  [
    [76, 61, 150, 59],
    [236, 61, 88, 59],
    [76, 130, 88, 59],
    [174, 130, 150, 59],
  ],
  [
    [76, 61, 248, 28],
    [76, 99, 70, 90],
    [156, 99, 168, 50],
    [156, 159, 168, 30],
  ],
];

export function LayoutGlyph({ id }: { id: string }) {
  const seq = [0, 0, 1, 1, 2, 2, 0];
  const keyTimes = "0;0.2;0.33;0.53;0.66;0.86;1";
  const fills = [
    "#ffffff",
    `url(#${id}-t1)`,
    `url(#${id}-t2)`,
    `url(#${id}-t3)`,
  ];
  return (
    <g>
      <defs>
        {[
          ["t1", "#7cc4ff", BRAND.blue],
          ["t2", "#a6f0b8", BRAND.green],
          ["t3", "#ffb3ad", BRAND.red],
        ].map(([k, a, b]) => (
          <linearGradient key={k} id={`${id}-${k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>
      <rect
        x="62"
        y="47"
        width="276"
        height="156"
        rx="16"
        fill="#ffffff"
        fillOpacity="0.07"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeDasharray="4 6"
      />
      {[0, 1, 2, 3].map((i) => {
        const vals = (k: number) =>
          seq.map((s) => LAYOUT_STATES[s][i][k]).join(";");
        const [x, y, w, h] = LAYOUT_STATES[0][i];
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="8"
            fill={fills[i]}
            fillOpacity="0.94"
          >
            {(["x", "y", "width", "height"] as const).map((attr, k) => (
              <animate
                key={attr}
                attributeName={attr}
                values={vals(k)}
                keyTimes={keyTimes}
                calcMode="spline"
                keySplines={ease(6)}
                dur="8s"
                repeatCount="indefinite"
              />
            ))}
          </rect>
        );
      })}
    </g>
  );
}

/* ---------- tinky: a React TUI with Flexbox panes, focus ring, progress ---------- */

export function TinkyGlyph({ id }: { id: string }) {
  const side: Box = [68, 92, 82, 116];
  const main: Box = [154, 92, 178, 116];
  const focus = (k: number) =>
    [side, side, main, main, side].map((b) => b[k]).join(";");
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
      </defs>
      <Terminal id={id} x={56} y={30} w={288} h={190} />
      <rect
        x="70"
        y="62"
        width="260"
        height="24"
        rx="6"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.45"
      />
      <text x="80" y="78" fill="#fff" fontFamily={MONO} fontSize="10">
        tinky
      </text>
      <circle cx="318" cy="74" r="4" fill={BRAND.green} />
      {/* sidebar */}
      <rect
        x="70"
        y="94"
        width="78"
        height="112"
        rx="6"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.3"
      />
      <rect
        x="76"
        y="101"
        width="66"
        height="17"
        rx="4"
        fill={BRAND.green}
        fillOpacity="0.3"
      >
        <animate
          attributeName="y"
          values="101;121;141;121;101"
          dur="8s"
          calcMode="spline"
          keySplines={ease(4)}
          repeatCount="indefinite"
        />
      </rect>
      {[106, 126, 146, 166].map((y) => (
        <rect
          key={y}
          x="82"
          y={y}
          width="48"
          height="7"
          rx="3.5"
          fill="#fff"
          fillOpacity="0.6"
        />
      ))}
      {/* main pane */}
      <rect
        x="156"
        y="94"
        width="174"
        height="112"
        rx="6"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.3"
      />
      <rect
        x="170"
        y="110"
        width="96"
        height="7"
        rx="3.5"
        fill="#fff"
        fillOpacity="0.85"
      />
      <rect
        x="170"
        y="126"
        width="64"
        height="7"
        rx="3.5"
        fill="#fff"
        fillOpacity="0.45"
      />
      <circle
        cx="306"
        cy="120"
        r="9"
        fill="none"
        stroke={`url(#${id}-frame)`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="22 40"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 306 120;360 306 120"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <rect
        x="170"
        y="172"
        width="146"
        height="9"
        rx="4.5"
        fill="#fff"
        fillOpacity="0.12"
      />
      <rect
        x="170"
        y="172"
        width="0"
        height="9"
        rx="4.5"
        fill={`url(#${id}-frame)`}
      >
        <animate
          attributeName="width"
          values="0;146;146"
          keyTimes="0;0.8;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>
      {/* focus ring moves between panes (Tab / Shift+Tab) */}
      <rect
        x={side[0]}
        y={side[1]}
        width={side[2]}
        height={side[3]}
        rx="8"
        fill="none"
        stroke={`url(#${id}-frame)`}
        strokeWidth="2"
      >
        {(["x", "y", "width", "height"] as const).map((attr, k) => (
          <animate
            key={attr}
            attributeName={attr}
            values={focus(k)}
            keyTimes="0;0.4;0.5;0.9;1"
            calcMode="spline"
            keySplines={ease(4)}
            dur="8s"
            repeatCount="indefinite"
          />
        ))}
      </rect>
    </g>
  );
}

/* ---------- ink-scroll-view: a viewport sliding over taller content ---------- */

const BLOCKS: [number, number][] = [
  [100, 14],
  [80, 8],
  [92, 8],
  [100, 24],
  [70, 8],
  [88, 8],
  [100, 14],
  [60, 8],
  [100, 30],
  [84, 8],
  [76, 8],
  [100, 14],
  [90, 8],
  [66, 8],
  [100, 22],
  [80, 8],
];

// Stack the blocks top to bottom with a 7px gap.
const SCROLL_BLOCKS = BLOCKS.reduce<{ y: number; w: number; h: number }[]>(
  (acc, [w, h]) => {
    const prev = acc[acc.length - 1];
    acc.push({ y: prev ? prev.y + prev.h + 7 : 30, w, h });
    return acc;
  },
  [],
);

export function ScrollViewGlyph({ id }: { id: string }) {
  const blocks = SCROLL_BLOCKS;
  const content = (opacity: number) => (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;0 -150;0 -150;0 0;0 0"
        keyTimes="0;0.42;0.5;0.92;1"
        calcMode="spline"
        keySplines={ease(4)}
        dur="8s"
        repeatCount="indefinite"
      />
      {blocks.map((b, i) => (
        <rect
          key={i}
          x="150"
          y={b.y}
          width={b.w}
          height={b.h}
          rx="4"
          fill={b.h > 10 ? `url(#${id}-frame)` : "#fff"}
          fillOpacity={opacity}
        />
      ))}
    </g>
  );
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
        <clipPath id={`${id}-vp`}>
          <rect x="130" y="62" width="140" height="126" rx="10" />
        </clipPath>
      </defs>
      {content(0.16)}
      <rect
        x="130"
        y="62"
        width="140"
        height="126"
        rx="10"
        fill="#0b1124"
        fillOpacity="0.75"
      />
      <g clipPath={`url(#${id}-vp)`}>{content(0.95)}</g>
      <rect
        x="130"
        y="62"
        width="140"
        height="126"
        rx="10"
        fill="none"
        stroke={`url(#${id}-frame)`}
        strokeWidth="2.5"
      />
      <rect
        x="282"
        y="62"
        width="5"
        height="126"
        rx="2.5"
        fill="#fff"
        fillOpacity="0.15"
      />
      <rect x="282" y="62" width="5" height="48" rx="2.5" fill="#fff">
        <animate
          attributeName="y"
          values="62;140;140;62;62"
          keyTimes="0;0.42;0.5;0.92;1"
          calcMode="spline"
          keySplines={ease(4)}
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>
      <text
        x="130"
        y="210"
        fill="#fff"
        fillOpacity="0.6"
        fontFamily={MONO}
        fontSize="10"
      >
        {"<ScrollView>"}
      </text>
    </g>
  );
}

/* ---------- ink-scroll-list: arrow keys move the selection ---------- */

const ROW_WIDTHS = [120, 90, 140, 80, 110, 100, 130];

export function ScrollListGlyph({ id }: { id: string }) {
  const rowY = (i: number) => 74 + i * 20;
  const steps = [0, 1, 2, 3, 4, 3, 2, 1, 0];
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
      </defs>
      <Terminal id={id} x={56} y={36} w={220} h={178} />
      <rect
        x="64"
        y={rowY(0) - 13}
        width="204"
        height="19"
        rx="5"
        fill={BRAND.green}
        fillOpacity="0.3"
      >
        <animate
          attributeName="y"
          values={steps.map((s) => rowY(s) - 13).join(";")}
          dur="8s"
          calcMode="spline"
          keySplines={ease(8)}
          repeatCount="indefinite"
        />
      </rect>
      {ROW_WIDTHS.map((w, i) => (
        <g key={i}>
          <text
            x="74"
            y={rowY(i)}
            fill={BRAND.green}
            fontFamily={MONO}
            fontSize="11"
          >
            ›
          </text>
          <rect
            x="88"
            y={rowY(i) - 7}
            width={w}
            height="8"
            rx="4"
            fill="#fff"
            fillOpacity={0.55}
          />
        </g>
      ))}
      {[
        { label: "↑", y: 92, on: "0.15;0.15;1;1" },
        { label: "↓", y: 136, on: "1;1;0.15;0.15" },
      ].map((k) => (
        <g key={k.label}>
          <rect
            x="296"
            y={k.y}
            width="36"
            height="36"
            rx="9"
            fill="#fff"
            fillOpacity="0.1"
            stroke="#fff"
            strokeOpacity="0.4"
          />
          <rect
            x="296"
            y={k.y}
            width="36"
            height="36"
            rx="9"
            fill={`url(#${id}-frame)`}
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values={k.on}
              keyTimes="0;0.5;0.5;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </rect>
          <text
            x="314"
            y={k.y + 24}
            textAnchor="middle"
            fill="#fff"
            fontFamily={MONO}
            fontSize="16"
          >
            {k.label}
          </text>
        </g>
      ))}
    </g>
  );
}

/* ---------- ink-scroll-bar: border, inset and dotted scroll bars ---------- */

export function ScrollBarGlyph({ id }: { id: string }) {
  const thumbAnim = (from: number, to: number, begin = "0s") => (
    <animate
      attributeName="y"
      values={`${from};${to};${to};${from};${from}`}
      keyTimes="0;0.42;0.5;0.92;1"
      calcMode="spline"
      keySplines={ease(4)}
      dur="8s"
      begin={begin}
      repeatCount="indefinite"
    />
  );
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
        <clipPath id={`${id}-box`}>
          <rect x="72" y="50" width="180" height="150" />
        </clipPath>
      </defs>
      <rect
        x="62"
        y="40"
        width="210"
        height="170"
        rx="10"
        fill="#0b1124"
        fillOpacity="0.85"
        stroke="#fff"
        strokeOpacity="0.45"
      />
      <g clipPath={`url(#${id}-box)`}>
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 -90;0 -90;0 0;0 0"
            keyTimes="0;0.42;0.5;0.92;1"
            calcMode="spline"
            keySplines={ease(4)}
            dur="8s"
            repeatCount="indefinite"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              x="80"
              y={58 + i * 20}
              width={[150, 110, 130, 90][i % 4]}
              height="8"
              rx="4"
              fill="#fff"
              fillOpacity={i % 3 ? 0.4 : 0.8}
            />
          ))}
        </g>
      </g>
      {/* border-mode bar replaces the right border */}
      <rect x="264" y="52" width="12" height="146" rx="6" fill="#0b1124" />
      <rect
        x="266"
        y="52"
        width="8"
        height="146"
        rx="4"
        fill="#fff"
        fillOpacity="0.15"
      />
      <rect
        x="266"
        y="52"
        width="8"
        height="52"
        rx="4"
        fill={`url(#${id}-frame)`}
      >
        {thumbAnim(52, 146)}
      </rect>
      {/* inset bars */}
      <rect
        x="302"
        y="52"
        width="10"
        height="146"
        rx="5"
        fill="#fff"
        fillOpacity="0.12"
      />
      <rect x="302" y="52" width="10" height="40" rx="5" fill="#fff">
        {thumbAnim(52, 158, "-2s")}
      </rect>
      <line
        x1="337"
        y1="54"
        x2="337"
        y2="196"
        stroke="#fff"
        strokeOpacity="0.35"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="0.1 9"
      />
      <rect x="333" y="52" width="8" height="34" rx="4" fill={BRAND.red}>
        {thumbAnim(52, 164, "-4s")}
      </rect>
      {["border", "inset", "dots"].map((label, i) => (
        <text
          key={label}
          x={[270, 307, 337][i]}
          y="222"
          textAnchor="middle"
          fill="#fff"
          fillOpacity="0.6"
          fontFamily={MONO}
          fontSize="8.5"
        >
          {label}
        </text>
      ))}
    </g>
  );
}

/* ---------- ink-multiline-input: lines typed with a moving cursor ---------- */

const TYPED = ["Build CLIs with", "multi-line input", "for Ink."];

export function MultilineGlyph({ id }: { id: string }) {
  const charW = 7.8;
  const baseX = 88;
  const lineY = [104, 128, 152];
  const widths = TYPED.map((t) => t.length * charW);
  // [start, end] typing window per line, in seconds.
  const windows = [
    [0.2, 1.8],
    [2, 3.6],
    [3.8, 5],
  ];
  const lineWidth = (i: number) => {
    const [s, e] = windows[i];
    return {
      values: `0;0;${widths[i]};${widths[i]};0;0`,
      keyTimes: kt([0, s, e, 7, 7.4, 8]),
    };
  };
  const cursorX = {
    values: [
      baseX,
      baseX + widths[0],
      baseX,
      baseX + widths[1],
      baseX,
      baseX + widths[2],
      baseX + widths[2],
      baseX,
      baseX,
    ].join(";"),
    keyTimes: kt(
      [0.2, 1.8, 1.81, 3.6, 3.61, 5, 7, 7.4, 8].map((t, i) =>
        i === 0 ? 0 : t,
      ),
    ),
  };
  const rowSeq = (offset: number) => ({
    values: [
      lineY[0],
      lineY[0],
      lineY[1],
      lineY[1],
      lineY[2],
      lineY[2],
      lineY[0],
      lineY[0],
    ]
      .map((v) => v + offset)
      .join(";"),
    keyTimes: kt([0, 1.8, 1.81, 3.6, 3.61, 7.4, 7.41, 8]),
  });
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
        {TYPED.map((_, i) => (
          <clipPath key={i} id={`${id}-l${i}`}>
            <rect x={baseX} y={lineY[i] - 14} width="0" height="20">
              <animate
                attributeName="width"
                {...lineWidth(i)}
                dur="8s"
                repeatCount="indefinite"
              />
            </rect>
          </clipPath>
        ))}
      </defs>
      <text
        x="70"
        y="62"
        fill="#fff"
        fillOpacity="0.6"
        fontFamily={MONO}
        fontSize="10"
      >
        {"<MultilineInput rows={3} />"}
      </text>
      <rect
        x="70"
        y="74"
        width="260"
        height="104"
        rx="12"
        fill="#0b1124"
        fillOpacity="0.88"
        stroke={`url(#${id}-frame)`}
        strokeWidth="2"
      />
      <rect
        x="78"
        y={lineY[0] - 16}
        width="244"
        height="22"
        rx="5"
        fill={BRAND.blue}
        fillOpacity="0.3"
      >
        <animate
          attributeName="y"
          {...rowSeq(-16)}
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>
      {TYPED.map((t, i) => (
        <text
          key={t}
          x={baseX}
          y={lineY[i]}
          fill="#fff"
          fontFamily={MONO}
          fontSize="13"
          clipPath={`url(#${id}-l${i})`}
        >
          {t}
        </text>
      ))}
      <rect
        x={baseX}
        y={lineY[0] - 12}
        width="7"
        height="15"
        fill={BRAND.green}
      >
        <animate
          attributeName="x"
          {...cursorX}
          dur="8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          {...rowSeq(-12)}
          dur="8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.5;0.5;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  );
}

/* ---------- ink-canvas: an Ink app inside a browser tab ---------- */

export function CanvasGlyph({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
      </defs>
      <rect
        x="48"
        y="30"
        width="304"
        height="192"
        rx="12"
        fill="#f8fafc"
        fillOpacity="0.95"
      />
      {["#cbd5e1", "#cbd5e1", "#cbd5e1"].map((c, i) => (
        <circle key={i} cx={66 + i * 13} cy="46" r="4.5" fill={c} />
      ))}
      <rect x="120" y="37" width="190" height="18" rx="9" fill="#e2e8f0" />
      <text x="134" y="50" fill="#475569" fontFamily={MONO} fontSize="9.5">
        localhost:5173
      </text>
      <rect x="60" y="64" width="280" height="146" rx="8" fill="#1a1b26" />
      <rect
        x="74"
        y="78"
        width="252"
        height="34"
        rx="9"
        fill="none"
        stroke={BRAND.green}
        strokeWidth="1.5"
      />
      <text x="88" y="99" fill="#e2e8f0" fontFamily={MONO} fontSize="10.5">
        Hello from Ink in the Browser!
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i} opacity="0">
          <animate
            attributeName="opacity"
            values="0;0;1;1;0"
            keyTimes={`0;${(0.15 + i * 0.18).toFixed(2)};${(0.2 + i * 0.18).toFixed(2)};0.92;1`}
            dur="4s"
            repeatCount="indefinite"
          />
          <text
            x="78"
            y={136 + i * 20}
            fill={BRAND.green}
            fontFamily={MONO}
            fontSize="11"
          >
            ›
          </text>
          <rect
            x="92"
            y={129 + i * 20}
            width={[150, 110, 130][i]}
            height="8"
            rx="4"
            fill="#fff"
            fillOpacity={i === 0 ? 0.85 : 0.5}
          />
        </g>
      ))}
      <rect x="78" y="190" width="7" height="12" fill="#e2e8f0">
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.5;0.5;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x="276"
        y="184"
        width="54"
        height="18"
        rx="9"
        fill={`url(#${id}-frame)`}
      />
      <text
        x="303"
        y="196.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily={MONO}
        fontSize="8.5"
      >
        xterm.js
      </text>
    </g>
  );
}

/* ---------- ghidra-bridge: a control-flow graph with requests flowing in ---------- */

const NODES: [number, number][] = [
  [200, 58],
  [116, 126],
  [284, 126],
  [200, 194],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
];

export function GraphGlyph({ id }: { id: string }) {
  const w = 84;
  const h = 36;
  const edge = ([a, b]: [number, number], move = true) => {
    const [x1, y1] = NODES[a];
    const [x2, y2] = NODES[b];
    const sy = y1 + h / 2;
    const ey = y2 - h / 2;
    const my = (sy + ey) / 2;
    return `${move ? `M${x1} ${sy} ` : `L${x1} ${sy} `}C${x1} ${my} ${x2} ${my} ${x2} ${ey}`;
  };
  const glowColors = [BRAND.blue, BRAND.green, BRAND.red, "#7cc4ff"];
  const routes = [
    edge(EDGES[0]) + " " + edge(EDGES[2], false),
    edge(EDGES[1]) + " " + edge(EDGES[3], false),
  ];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc4ff" />
          <stop offset="1" stopColor={BRAND.red} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      {EDGES.map((e, i) => (
        <g key={i}>
          <path
            d={edge(e)}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.18"
            strokeWidth="3"
          />
          <path
            d={edge(e)}
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 14"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-48"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
      {NODES.map(([cx, cy], i) => (
        <g key={i}>
          <rect
            x={cx - w / 2}
            y={cy - h / 2}
            width={w}
            height={h}
            rx="9"
            fill={glowColors[i]}
            filter={`url(#${id}-blur)`}
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.9;0;0"
              keyTimes="0;0.15;0.4;1"
              dur="4s"
              begin={`${i - 4}s`}
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x={cx - w / 2}
            y={cy - h / 2}
            width={w}
            height={h}
            rx="9"
            fill="#0b1124"
            fillOpacity="0.9"
            stroke="#fff"
            strokeOpacity="0.55"
          />
          <rect
            x={cx - w / 2 + 10}
            y={cy - 8}
            width={w * 0.55}
            height="5"
            rx="2.5"
            fill="#fff"
            fillOpacity="0.8"
          />
          <rect
            x={cx - w / 2 + 10}
            y={cy + 3}
            width={w * 0.35}
            height="5"
            rx="2.5"
            fill={glowColors[i]}
          />
        </g>
      ))}
      {routes.map((d, i) => (
        <circle key={i} r="4.5" fill="#fff">
          <animateMotion
            path={d}
            dur="2s"
            begin={`${-i}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <g fontFamily={MONO} fontSize="9">
        <rect
          x="20"
          y="20"
          width="52"
          height="20"
          rx="10"
          fill="#fff"
          fillOpacity="0.12"
          stroke="#fff"
          strokeOpacity="0.35"
        />
        <text x="46" y="33.5" textAnchor="middle" fill="#fff">
          MCP
        </text>
        <rect
          x="300"
          y="20"
          width="80"
          height="20"
          rx="10"
          fill="#fff"
          fillOpacity="0.12"
          stroke="#fff"
          strokeOpacity="0.35"
        />
        <text x="340" y="33.5" textAnchor="middle" fill="#fff">
          JSON-RPC
        </text>
      </g>
    </g>
  );
}

/* ---------- headless-ghidra: the P0 → P4 pipeline producing artifacts ---------- */

export function PipelineGlyph({ id }: { id: string }) {
  const xs = [80, 140, 200, 260, 320];
  const y = 92;
  // Stage i lights at 0.4 + 1.3·i seconds; all reset at 7.4s.
  const on = (i: number) => {
    const t = 0.4 + i * 1.3;
    return {
      values: "0;0;1;1;0;0",
      keyTimes: kt([0, t, t + 0.3, 7.2, 7.5, 8]),
    };
  };
  return (
    <g>
      <defs>
        <FrameGradient id={id} />
      </defs>
      <rect
        x="80"
        y={y - 2}
        width="240"
        height="4"
        rx="2"
        fill="#fff"
        fillOpacity="0.15"
      />
      <rect
        x="80"
        y={y - 2}
        width="0"
        height="4"
        rx="2"
        fill={`url(#${id}-frame)`}
      >
        <animate
          attributeName="width"
          values="0;0;240;240;0;0"
          keyTimes={kt([0, 0.4, 5.9, 7.2, 7.5, 8])}
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>
      {xs.map((x, i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="17"
            fill="#0b1124"
            stroke="#fff"
            strokeOpacity="0.45"
          />
          <circle cx={x} cy={y} r="17" fill={`url(#${id}-frame)`} opacity="0">
            <animate
              attributeName="opacity"
              {...on(i)}
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill="#fff"
            fontFamily={MONO}
            fontSize="11"
            fontWeight="600"
          >
            P{i}
          </text>
          <g opacity="0">
            <animate
              attributeName="opacity"
              {...on(i)}
              dur="8s"
              repeatCount="indefinite"
            />
            <rect
              x={x - 15}
              y="124"
              width="30"
              height="38"
              rx="4"
              fill="#fff"
              fillOpacity="0.92"
            />
            <rect
              x={x - 9}
              y="133"
              width="18"
              height="3"
              rx="1.5"
              fill="#0b1124"
              fillOpacity="0.7"
            />
            <rect
              x={x - 9}
              y="140"
              width="14"
              height="3"
              rx="1.5"
              fill="#0b1124"
              fillOpacity="0.4"
            />
            <rect
              x={x - 9}
              y="147"
              width="16"
              height="3"
              rx="1.5"
              fill="#0b1124"
              fillOpacity="0.4"
            />
            <text
              x={x}
              y="158.5"
              textAnchor="middle"
              fill="#0b1124"
              fontFamily={MONO}
              fontSize="6"
            >
              .md
            </text>
          </g>
        </g>
      ))}
      <text
        x="200"
        y="196"
        textAnchor="middle"
        fill="#fff"
        fillOpacity="0.6"
        fontFamily={MONO}
        fontSize="10"
      >
        artifacts/&lt;target-id&gt;/
      </text>
    </g>
  );
}

export const PROJECT_GLYPHS: Record<string, typeof LayoutGlyph> = {
  "taffy-layout": LayoutGlyph,
  tinky: TinkyGlyph,
  "ink-scroll-view": ScrollViewGlyph,
  "ink-scroll-list": ScrollListGlyph,
  "ink-scroll-bar": ScrollBarGlyph,
  "ink-multiline-input": MultilineGlyph,
  "ink-canvas": CanvasGlyph,
  "ghidra-bridge": GraphGlyph,
  "headless-ghidra": PipelineGlyph,
};
