import Reveal from "../../components/Reveal";
import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBolt,
  FaBookOpen,
  FaCode,
  FaCrosshairs,
  FaFileLines,
  FaGithub,
  FaGlobe,
  FaKeyboard,
  FaLayerGroup,
  FaMask,
  FaPalette,
  FaPlug,
  FaRobot,
  FaRotate,
  FaRulerCombined,
  FaShieldHalved,
  FaShareNodes,
  FaTableCellsLarge,
  FaTerminal,
  FaAnchor,
  FaArrowsUpDown,
} from "react-icons/fa6";
import Page from "../../components/Page";
import CopyCommand from "../../components/CopyCommand";
import CodeBlock from "../../components/CodeBlock";
import LoopVideo from "../../components/LoopVideo";
import { vt } from "../../lib/viewTransition";
import ProjectCard from "../../components/ProjectCard";
import LanguageBadge from "../../components/LanguageBadge";
import ProjectArt from "../../components/art/ProjectArt";
import {
  getCategory,
  getProject,
  getProjectsByCategory,
  getRepoUrl,
  projects,
} from "../../config/projects";
import { projectPages, type HighlightIcon } from "../../config/project-pages";

const ICONS: Record<HighlightIcon, IconType> = {
  bolt: FaBolt,
  layers: FaLayerGroup,
  grid: FaTableCellsLarge,
  ruler: FaRulerCombined,
  code: FaCode,
  keyboard: FaKeyboard,
  scroll: FaArrowsUpDown,
  focus: FaCrosshairs,
  palette: FaPalette,
  mask: FaMask,
  browser: FaGlobe,
  plug: FaPlug,
  shield: FaShieldHalved,
  graph: FaShareNodes,
  robot: FaRobot,
  file: FaFileLines,
  refresh: FaRotate,
  anchor: FaAnchor,
  terminal: FaTerminal,
};

const ACCENTS = [
  "bg-rgb-blue text-white",
  "bg-rgb-green text-white",
  "bg-rgb-red text-white",
  "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
];

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map((p) => ({ params: { id: p.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  const project = getProject(id);
  const page = projectPages[id];
  if (!project || !page) {
    return { notFound: true };
  }
  return { props: { id } };
};

export default function ProjectPage({ id }: { id: string }) {
  const project = getProject(id);
  const page = projectPages[id];
  if (!project || !page) {
    return null;
  }
  const category = getCategory(project.category);
  const siblings = getProjectsByCategory(project.category).filter(
    (p) => p.id !== id,
  );
  const index = projects.findIndex((p) => p.id === id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const repoUrl = getRepoUrl(project);

  return (
    <Page>
      <Head>
        <title>{`${project.name} - ByteLand Technology`}</title>
        <meta
          key="description"
          name="description"
          content={project.description}
        />
      </Head>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-tri opacity-15 blur-3xl dark:opacity-20 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pb-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-rgb-blue transition-colors cursor-pointer"
          >
            <FaArrowLeft className="w-3 h-3" />
            All projects
          </Link>
          <div className="mt-8 grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
            {/* The name and artwork are shared elements: they morph from the
                project card on Home. Everything else fades in around them. */}
            <div className="min-w-0">
              <Reveal
                as="p"
                className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500"
              >
                {category.title}
              </Reveal>
              <h1
                className="mt-3 font-mono text-4xl sm:text-5xl font-bold tracking-tight break-words"
                style={vt("title", project.id, { text: true })}
              >
                {project.name}
              </h1>
              <Reveal delay={0.04}>
                <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-lg">
                  {page.headline}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    <FaGithub className="w-4 h-4" />
                    GitHub
                  </a>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 font-semibold hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-900"
                    >
                      <FaBookOpen className="w-4 h-4" />
                      Docs &amp; demos
                    </a>
                  )}
                </div>
                {project.install && (
                  <div className="mt-6 max-w-md">
                    <CopyCommand command={project.install} />
                  </div>
                )}
                <div className="mt-5">
                  <LanguageBadge language={project.language} />
                </div>
              </Reveal>
            </div>
            <div className="min-w-0">
              <LoopVideo
                name={project.id}
                className="rounded-[28px] shadow-2xl shadow-blue-900/30 aspect-[400/250]"
                style={vt("art", project.id)}
              >
                <ProjectArt id={project.id} />
              </LoopVideo>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {page.highlights.map((h, i) => {
            const Icon = ICONS[h.icon];
            return (
              <Reveal
                key={h.title}
                delay={i * 0.04}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${ACCENTS[i % 4]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 font-semibold">{h.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {h.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      {page.steps && (
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10">
              How it works
            </h2>
            <ol
              className={`grid grid-cols-1 gap-6 ${
                page.steps.length > 3 ? "md:grid-cols-5" : "md:grid-cols-3"
              }`}
            >
              {page.steps.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={i * 0.04}
                  className="relative"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-tri font-mono text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    {i < page.steps!.length - 1 && (
                      <span className="hidden md:block h-px flex-1 bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Quick start */}
      <section
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${page.steps ? "py-20" : "pb-20"}`}
      >
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Quick start
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              From the project README. See GitHub for the full API.
            </p>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-rgb-blue hover:underline"
            >
              Read the docs on GitHub
              <FaArrowRight className="w-3 h-3" />
            </a>
          </div>
          <Reveal className="min-w-0">
            <CodeBlock {...page.code} />
          </Reveal>
        </div>
      </section>

      {/* Ecosystem */}
      {page.ecosystem && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
            Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {page.ecosystem.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.packages.map((pkg) => (
                    <li key={pkg}>
                      <a
                        href={`https://github.com/ByteLandTechnology/${pkg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-mono text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-rgb-blue hover:text-white transition-colors dark:bg-slate-800 dark:text-slate-300"
                      >
                        {pkg.replace(/^tinky-/, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* More */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {siblings.length > 0 && (
            <>
              <h2 className="text-xl font-bold tracking-tight mb-6">
                More {category.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {siblings.map((p) => (
                  <ProjectCard key={p.id} project={p} shared={false} />
                ))}
              </div>
            </>
          )}
          <nav className="grid grid-cols-2 gap-4">
            {[
              { p: prev, label: "Previous", align: "text-left" },
              { p: next, label: "Next", align: "text-right" },
            ].map(({ p, label, align }) => (
              <Link
                key={label}
                href={`/opensource/${p.id}`}
                scroll={false}
                className={`group rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg transition-shadow dark:border-slate-800 dark:bg-slate-900 ${align}`}
              >
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  {label}
                </span>
                <span className="mt-1 block font-mono font-semibold truncate group-hover:text-rgb-blue transition-colors">
                  {p.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </Page>
  );
}
