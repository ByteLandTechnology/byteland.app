import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCalendarDays,
  FaUser,
  FaTag,
  FaSpinner,
  FaTriangleExclamation,
} from "react-icons/fa6";
import Page from "../../components/Page";
import { FooterConfig } from "../../components/Footer";
import { getSortedPostsData } from "../../lib/blog";
import type { GetStaticProps } from "next";

// This interface should match the structure of your blog-index.json objects
interface PostMetadata {
  title: string;
  date: string;
  tags: string[];
  author: string;
  slug: string;
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPosts: allPostsData,
    },
  };
};

/**
 * A simple, non-cryptographic hash function to create a stable number from a string.
 * @param str The string to hash.
 * @returns A number representing the hash.
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = char + (hash << 6) + (hash << 16) - hash;
  }
  return hash;
};

export default function Blog({ allPosts }: { allPosts: PostMetadata[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();

  const filteredPosts = selectedTag
    ? allPosts.filter((p) => p.tags.includes(selectedTag))
    : allPosts;

  const tagColorClasses = [
    {
      bg: "bg-rgb-blue/10",
      text: "text-rgb-blue",
      hover: "hover:bg-rgb-blue/20",
    },
    {
      bg: "bg-rgb-green/10",
      text: "text-rgb-green",
      hover: "hover:bg-rgb-green/20",
    },
    { bg: "bg-rgb-red/10", text: "text-rgb-red", hover: "hover:bg-rgb-red/20" },
  ];

  const getTagColor = (tag: string) => {
    const hash = simpleHash(tag);
    const index = Math.abs(hash) % tagColorClasses.length;
    return tagColorClasses[index];
  };

  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "ByteLog",
      description: "Insights and updates from the ByteLand team.",
      icon: "/assets/images/bytelog-icon.svg",
    },
    socials: true,
  };

  return (
    <Page footerConfig={footerConfig}>
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-center mb-4">
              The <span className="text-gradient-tri">ByteLog</span>
            </h1>
            <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12">
              Tutorials, product announcements, and deep dives into our
              technology.
            </p>
          </motion.div>

          {/* Tag Filter Section */}
          {allPosts.length > 0 && (
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  selectedTag === null
                    ? "bg-slate-900 text-white shadow"
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Posts
              </button>
              {allTags.map((tag) => {
                const colors = getTagColor(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                      selectedTag === tag
                        ? "bg-slate-900 text-white shadow"
                        : `${colors.bg} ${colors.text} ${colors.hover}`
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </motion.div>
          )}

          {filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                const accentColorClasses = [
                  "border-t-rgb-red",
                  "border-t-rgb-green",
                  "border-t-rgb-blue",
                ];
                const accentClass = accentColorClasses[index % 3];

                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group h-full"
                    >
                      <article
                        className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 h-full flex flex-col ${accentClass}`}
                      >
                        <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <FaCalendarDays className="w-4 h-4" />
                            <span>
                              {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-rgb-blue transition-colors flex-grow">
                          {post.title}
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-auto">
                          {post.tags.map((tag) => {
                            const colors = getTagColor(tag);
                            return (
                              <span
                                key={tag}
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <FaTag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-700">
                No posts found
              </h2>
              <p className="text-slate-500 mt-2">
                There are no posts matching the tag "{selectedTag}".
              </p>
              <button
                onClick={() => setSelectedTag(null)}
                className="mt-6 px-5 py-2 text-sm font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-colors"
              >
                View All Posts
              </button>
            </div>
          )}
        </div>
      </section>
    </Page>
  );
}
