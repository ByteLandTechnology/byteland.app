import Link from "next/link";
import type { PostMeta } from "../lib/blog";
import GradientCover from "./art/GradientCover";
import { vt } from "../lib/viewTransition";

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export function PostCover({
  post,
  className = "",
}: {
  post: PostMeta;
  className?: string;
}) {
  return post.image ? (
    <img
      src={post.image}
      alt=""
      className={`block w-full aspect-[16/9] object-cover bg-slate-100 dark:bg-white ${className}`}
    />
  ) : (
    <GradientCover
      seed={post.slug}
      label={post.tags[0]}
      className={className}
    />
  );
}

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      scroll={false}
      className="motion-card group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="overflow-hidden" style={vt("cover", post.slug)}>
        <PostCover post={post} className="motion-card-art" />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <time className="font-mono text-xs text-slate-500">
          {formatDate(post.date)}
        </time>
        <h3
          className="mt-2 font-semibold leading-snug group-hover:text-rgb-blue transition-colors"
          style={vt("post", post.slug, { text: true })}
        >
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </Link>
  );
}
