import { motion } from "framer-motion";
import { FaCalendarDays, FaUser, FaArrowLeft } from "react-icons/fa6";
import Page from "../../components/Page";
import { FooterConfig } from "../../components/Footer";
import MarkdownRenderer from "../../components/MarkdownRenderer";
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
  const slugString = slugArray.join("/");
  const postData = await getPostData(slugString);
  return {
    props: {
      post: postData,
    },
  };
};

export default function BlogPost({ post }: { post: Post }) {
  const renderContent = () => {
    return (
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Post Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            {post.title}
          </h1>
          <div className="flex justify-center items-center gap-6 text-md text-slate-500">
            <div className="flex items-center gap-2">
              <FaCalendarDays className="w-5 h-5" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="w-5 h-5" />
              <span>{post.author}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Post Content */}
        <MarkdownRenderer
          content={post.content}
          basePath={`/posts/${post.slug.split("/")[0]}`}
        />
      </motion.article>
    );
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
    <Page footerConfig={footerConfig} className="bg-white">
      <div className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-600 hover:text-rgb-blue mb-8"
          >
            <FaArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>
          {renderContent()}
        </div>
      </div>
    </Page>
  );
}
