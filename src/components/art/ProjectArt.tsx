import { getProject, type Category } from "../../config/projects";
import { Backdrop } from "./Backdrop";
import { PROJECT_GLYPHS } from "./glyphs";
import { useArt } from "./useArtId";

/** Which brand hue leads each category's backdrop. */
export const ART_LEAD: Record<Category, number> = {
  layout: 0,
  tinky: 1,
  ink: 1,
  "reverse-engineering": 2,
};

/** A project's animated gradient illustration (400×250). */
export default function ProjectArt({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const { prefix, ref } = useArt();
  const project = getProject(id);
  const Glyph = PROJECT_GLYPHS[id];
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 250"
      className={`block w-full h-auto ${className}`}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <Backdrop id={prefix} lead={project ? ART_LEAD[project.category] : 0} />
      {Glyph && <Glyph id={`${prefix}-g`} />}
    </svg>
  );
}
