import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Project } from "../config/projects";
import { projectPages } from "../config/project-pages";
import LanguageBadge from "./LanguageBadge";
import ProjectArt from "./art/ProjectArt";
import { vt } from "../lib/viewTransition";

const cardClass =
  "motion-card group overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default function ProjectCard({
  project,
  wide = false,
  shared = true,
}: {
  project: Project;
  /** Horizontal layout for a project that has a row to itself. */
  wide?: boolean;
  /** Morph into the project page hero on navigation (off for secondary
   *  lists, so only the clicked project moves). */
  shared?: boolean;
}) {
  // The art and name are shared elements: they morph into the hero of the
  // project page on navigation.
  const art = (
    <div
      className="overflow-hidden"
      style={shared ? vt("art", project.id) : undefined}
    >
      <ProjectArt id={project.id} className="motion-card-art" />
    </div>
  );
  const title = (
    <div className="flex items-center justify-between gap-3">
      <h3
        className="font-mono font-semibold text-slate-900 dark:text-white truncate"
        style={shared ? vt("title", project.id, { text: true }) : undefined}
      >
        {project.name}
      </h3>
      <FaArrowRight className="motion-card-arrow w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
    </div>
  );

  if (wide) {
    const page = projectPages[project.id];
    return (
      <Link
        href={`/opensource/${project.id}`}
        scroll={false}
        className={`${cardClass} grid md:grid-cols-2 items-center`}
      >
        {art}
        <div className="p-6 md:p-8">
          {title}
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {page?.headline ?? project.tagline}
          </p>
          {page && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {page.highlights.map((h) => (
                <li
                  key={h.title}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {h.title}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5">
            <LanguageBadge language={project.language} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/opensource/${project.id}`}
      scroll={false}
      className={`${cardClass} flex flex-col h-full`}
    >
      {art}
      <div className="flex flex-col flex-1 p-5">
        {title}
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 flex-1">
          {project.tagline}
        </p>
        <div className="mt-4">
          <LanguageBadge language={project.language} />
        </div>
      </div>
    </Link>
  );
}
