import Reveal from "../../components/Reveal";
import Head from "next/head";
import { FaArrowLeft } from "react-icons/fa6";
import Page from "../../components/Page";
import { formatDate, PostCover } from "../../components/PostCard";
import { vt } from "../../lib/viewTransition";
import { createMarkdownComponents } from "../../components/MarkdownRenderer";
import { MDXRemote } from "next-mdx-remote";
import { getAllPostSlugs, getPostData, Post } from "../../lib/blog";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params.slug is now an array like ['2025-12', 'hello-byteland']
  const slugArray = params?.slug as string[];
  if (
    !Array.isArray(slugArray) ||
    slugArray.length === 0 ||
    !slugArray.every((segment) => typeof segment === "string")
  ) {
    return { notFound: true };
  }
  const slugString = slugArray.join("/");
  const postData = await getPostData(slugString);
  if (!postData) {
    return { notFound: true };
  }
  return {
    props: {
      post: postData,
    },
  };
};

export default function BlogPost({ post }: { post: Post }) {
  return (
    <Page>
      <Head>
        <title>{`${post.title} - ByteLand Technology`}</title>
        {post.description && (
          <meta
            key="description"
            name="description"
            content={post.description}
          />
        )}
      </Head>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-rgb-blue mb-10 transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          All posts
        </Link>
        {/* The cover and title morph from the post card (shared elements). */}
        <article>
          <div
            className="mb-8 overflow-hidden rounded-3xl shadow-xl shadow-blue-900/10"
            style={vt("cover", post.slug)}
          >
            <PostCover post={post} />
          </div>
          <header className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
            <time className="font-mono text-sm text-slate-500">
              {formatDate(post.date)}
            </time>
            <h1
              className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              style={vt("post", post.slug, { text: true })}
            >
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span>{post.author}</span>
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </header>

          <Reveal className="max-w-none">
            <MDXRemote
              {...post.mdxSource}
              components={createMarkdownComponents(
                `/posts/${post.slug.split("/")[0]}`,
              )}
            />
          </Reveal>
        </article>
      </div>
    </Page>
  );
}
