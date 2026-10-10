import { useState } from "react";
import FilterCardMotion from "../../components/FilterCardMotion";
import Reveal from "../../components/Reveal";
import { useStableFilter } from "../../hooks/useStableFilter";
import Page from "../../components/Page";
import PostCard from "../../components/PostCard";
import FilterChips from "../../components/FilterChips";
import { getSortedPostsData, PostMeta } from "../../lib/blog";
import type { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => ({
  props: { allPosts: getSortedPostsData() },
});

export default function Blog({ allPosts }: { allPosts: PostMeta[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterRevision, setFilterRevision] = useState(0);
  const { controlsRef, spacerRef, prepareChange } =
    useStableFilter(selectedTag);

  const allTags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();
  const filteredPosts = selectedTag
    ? allPosts.filter((p) => p.tags.includes(selectedTag))
    : allPosts;

  return (
    <Page>
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-tri opacity-15 blur-3xl [mask-image:linear-gradient(to_bottom,black_30%,transparent)] dark:opacity-20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <Reveal
            as="h1"
            className="text-4xl sm:text-6xl font-extrabold tracking-tight"
          >
            <span className="text-gradient-tri">ByteLog</span>
          </Reveal>
          {allTags.length > 0 && (
            <div className="mt-8">
              <FilterChips
                value={selectedTag}
                containerRef={controlsRef}
                onChange={(tag) => {
                  prepareChange();
                  setSelectedTag(tag);
                  setFilterRevision((revision) => revision + 1);
                }}
                options={[
                  { value: null, label: "All" },
                  ...allTags.map((tag) => ({ value: tag, label: tag })),
                ]}
              />
            </div>
          )}
        </div>
      </section>

      <div
        data-filter-results
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
        style={{ overflowAnchor: "none", overflow: "clip" }}
      >
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="min-w-0"
                data-tags={post.tags.join("|")}
              >
                <FilterCardMotion revision={filterRevision} className="h-full">
                  <PostCard post={post} />
                </FilterCardMotion>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-slate-500">No posts yet.</p>
        )}
        <div ref={spacerRef} data-filter-spacer aria-hidden />
      </div>
    </Page>
  );
}
