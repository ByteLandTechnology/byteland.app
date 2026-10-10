import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// Fonts are bundled from npm so renders need no network access.
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import { Backdrop } from "../../src/components/art/Backdrop";
import { PROJECT_GLYPHS } from "../../src/components/art/glyphs";
import { ART_LEAD } from "../../src/components/art/ProjectArt";
import { getProject } from "../../src/config/projects";
import { projectPages } from "../../src/config/project-pages";
import { Seek } from "./Seek";

const inter = '"Inter", sans-serif';
const mono = '"JetBrains Mono", monospace';

/**
 * A project's showcase loop: its site animation on the right, with the name,
 * tagline and highlights (from ../src/config) cycling on the left.
 */
export function ProjectReel({ id }: { id: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const project = getProject(id)!;
  const highlights = projectPages[id].highlights;
  const Glyph = PROJECT_GLYPHS[id];

  const slot = durationInFrames / highlights.length;
  const current = Math.floor(frame / slot) % highlights.length;
  const local = frame - current * slot;
  const fade = 8;
  const opacity = interpolate(
    local,
    [0, fade, slot - fade, slot],
    [0, 1, 1, 0],
  );
  const shift = interpolate(local, [0, fade], [12, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Seek>
        <svg viewBox="0 0 400 250" width="100%" height="100%">
          <Backdrop id="bd" lead={ART_LEAD[project.category]} />
          <g transform="translate(122 30) scale(0.76)">
            <Glyph id="gl" />
          </g>
        </svg>
      </Seek>
      <AbsoluteFill
        style={{
          padding: "64px 0 64px 48px",
          justifyContent: "center",
          width: 380,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 36,
            color: "#fff",
            lineHeight: 1.1,
            wordBreak: "break-word",
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 500,
            fontSize: 21,
            color: "rgba(255,255,255,0.8)",
            marginTop: 14,
            lineHeight: 1.35,
          }}
        >
          {project.tagline}
        </div>
        <div
          style={{
            marginTop: 30,
            alignSelf: "flex-start",
            opacity,
            transform: `translateY(${shift}px)`,
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.35)",
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 19,
            color: "#fff",
          }}
        >
          {highlights[current].title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
