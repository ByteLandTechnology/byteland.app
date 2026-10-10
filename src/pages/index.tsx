import { useState } from "react";
import FilterCardMotion from "../components/FilterCardMotion";
import Reveal from "../components/Reveal";
import { useMotionPolicy } from "../hooks/useMotionPolicy";
import { useStableFilter } from "../hooks/useStableFilter";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { FaArrowRight, FaGithub } from "react-icons/fa6";
import Page from "../components/Page";
import ProjectCard from "../components/ProjectCard";
import FilterChips from "../components/FilterChips";
import PostCard from "../components/PostCard";
import LoopVideo from "../components/LoopVideo";
import HeroArt from "../components/art/HeroArt";
import {
  Category,
  categories,
  getProjectsByCategory,
} from "../config/projects";
import { getSortedPostsData, PostMeta } from "../lib/blog";

export const getStaticProps: GetStaticProps = async () => ({
  props: { latestPosts: getSortedPostsData().slice(0, 3) },
});

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rgb-blue dark:text-slate-400"
        >
          {linkLabel}
          <FaArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

export default function Home({ latestPosts }: { latestPosts: PostMeta[] }) {
  const [filter, setFilter] = useState<Category | null>(null);
  const [filterRevision, setFilterRevision] = useState(0);
  const { allowMotion } = useMotionPolicy();
  const { controlsRef, spacerRef, prepareChange } = useStableFilter(filter);

  return (
    <Page>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-tri opacity-20 blur-3xl [mask-image:linear-gradient(to_bottom,black_30%,transparent)] dark:opacity-25" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <Reveal>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02]">
              Open-source
              <br />
              <span className="text-gradient-tri">building blocks</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-md">
              A layout engine, a React framework for CLIs, Ink components and
              Ghidra tooling.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({
                    behavior: allowMotion ? "smooth" : "instant",
                  });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-tri text-white font-semibold shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Explore projects
                <FaArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="https://github.com/ByteLandTechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <FaGithub className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <LoopVideo
              name="hero"
              className="rounded-[28px] shadow-2xl shadow-blue-900/30 aspect-[560/460]"
            >
              <HeroArt />
            </LoopVideo>
          </Reveal>
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="scroll-mt-16 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Projects
            </h2>
            <FilterChips
              value={filter}
              containerRef={controlsRef}
              onChange={(v) => {
                prepareChange();
                setFilter(v as Category | null);
                setFilterRevision((revision) => revision + 1);
              }}
              options={[
                { value: null, label: "All" },
                ...categories.map((c) => ({ value: c.id, label: c.title })),
              ]}
            />
          </div>
          <div
            data-filter-results
            className="flex flex-col gap-14"
            style={{ overflowAnchor: "none", overflow: "clip" }}
          >
            {categories
              .filter((c) => !filter || c.id === filter)
              .map((category) => (
                <div
                  key={category.id}
                  id={category.id}
                  data-group={category.id}
                  className="scroll-mt-24"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
                    <h3 className="text-xl font-bold tracking-tight">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {category.blurb}
                    </p>
                  </div>
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                      getProjectsByCategory(category.id).length > 2
                        ? "lg:grid-cols-3"
                        : ""
                    }`}
                  >
                    {getProjectsByCategory(category.id).map(
                      (project, _, group) => (
                        <FilterCardMotion
                          key={project.id}
                          revision={filterRevision}
                          className={`min-w-0 ${group.length === 1 ? "sm:col-span-2" : ""}`}
                        >
                          <ProjectCard
                            project={project}
                            wide={group.length === 1}
                          />
                        </FilterCardMotion>
                      ),
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div
            ref={spacerRef}
            data-filter-spacer
            aria-hidden
            style={{ overflowAnchor: "none" }}
          />
        </div>
      </section>

      {/* Latest posts */}
      {latestPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeading
            title="From the blog"
            href="/blog"
            linkLabel="All posts"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Reveal key={post.slug} className="min-w-0">
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Reveal className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center">
          <div className="absolute inset-0 bg-gradient-tri opacity-30 blur-2xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built in the open.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/ByteLandTechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-200 transition-colors"
              >
                <FaGithub className="w-4 h-4" />
                Star us on GitHub
              </a>
              <a
                href="mailto:info@byteland.app"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                info@byteland.app
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </Page>
  );
}
