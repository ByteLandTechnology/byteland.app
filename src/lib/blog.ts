import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  author: string;
  description: string | null;
  /** Absolute URL path to the cover image, if the post has one. */
  image: string | null;
}

export interface Post extends PostMeta {
  mdxSource: MDXRemoteSerializeResult;
  content: string; // Keep raw content just in case
}

const postsDirectory = path.join(process.cwd(), "public", "posts");

interface PostFile {
  slug: string; // format: 'year-month/title'
  fullPath: string;
}

function listPostFiles(dir = postsDirectory, baseDir = ""): PostFile[] {
  const files: PostFile[] = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(
        ...listPostFiles(fullPath, baseDir ? `${baseDir}/${item}` : item),
      );
    } else if (item.endsWith(".md")) {
      const name = item.replace(/\.md$/, "");
      files.push({ slug: baseDir ? `${baseDir}/${name}` : name, fullPath });
    }
  }
  return files;
}

/** Today's date as YYYY-MM-DD (UTC), the cut-off for scheduled posts. */
const today = () => new Date().toISOString().slice(0, 10);

/** YAML turns unquoted dates into Date objects; normalise to YYYY-MM-DD. */
const normalizeDate = (date: unknown) =>
  date instanceof Date
    ? date.toISOString().slice(0, 10)
    : String(date ?? "").slice(0, 10);

/**
 * A post is published unless it is marked `draft: true` or dated in the
 * future. Scheduled posts go live on the first build on or after their date.
 */
export function isPublished(data: { draft?: boolean; date?: unknown }) {
  if (data.draft) return false;
  return !data.date || normalizeDate(data.date) <= today();
}

function resolveImage(slug: string, image?: string): string | null {
  if (!image) return null;
  if (/^(https?:)?\//.test(image)) return image;
  const dir = slug.split("/").slice(0, -1).join("/");
  return `/posts/${dir ? dir + "/" : ""}${image.replace(/^\.\//, "")}`;
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug, // Always use the generated slug, never the frontmatter one
    title: String(data.title ?? slug),
    date: normalizeDate(data.date),
    tags: (data.tags as string[]) ?? [],
    author: String(data.author ?? "The ByteLand Team"),
    description: (data.description as string) ?? null,
    image: resolveImage(slug, data.image as string | undefined),
  };
}

function publishedFiles() {
  return listPostFiles()
    .map((file) => ({
      ...file,
      parsed: matter(fs.readFileSync(file.fullPath, "utf8")),
    }))
    .filter((file) => isPublished(file.parsed.data));
}

function isWithinDirectory(directory: string, candidate: string) {
  const relative = path.relative(directory, candidate);
  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

/** Resolve only ordinary post slugs, and verify both lexical and real paths. */
function resolvePostPath(slug: string): string | null {
  if (
    typeof slug !== "string" ||
    slug.length === 0 ||
    slug.includes("\\") ||
    slug.includes("\0") ||
    path.posix.isAbsolute(slug) ||
    path.win32.isAbsolute(slug)
  ) {
    return null;
  }

  const segments = slug.split("/");
  if (
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    return null;
  }

  const postsRoot = path.resolve(postsDirectory);
  const fullPath = path.resolve(postsRoot, `${slug}.md`);
  if (!isWithinDirectory(postsRoot, fullPath) || !fs.existsSync(fullPath)) {
    return null;
  }

  // Also reject symlinked post files or directories that escape the posts root.
  try {
    if (!fs.statSync(fullPath).isFile()) return null;
    const realRoot = fs.realpathSync(postsRoot);
    const realPath = fs.realpathSync(fullPath);
    if (!isWithinDirectory(realRoot, realPath)) return null;
  } catch {
    return null;
  }

  return fullPath;
}

export function getSortedPostsData(): PostMeta[] {
  return publishedFiles()
    .map((file) => toMeta(file.slug, file.parsed.data))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs() {
  // Slug array for the catch-all route: ['year-month', 'title']
  return publishedFiles().map((file) => ({
    params: { slug: file.slug.split("/") },
  }));
}

export async function getPostData(slug: string): Promise<Post | null> {
  const fullPath = resolvePostPath(slug);
  if (!fullPath) return null;

  const matterResult = matter(fs.readFileSync(fullPath, "utf8"));
  if (!isPublished(matterResult.data)) return null;
  const mdxSource = await serialize(matterResult.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return {
    ...toMeta(slug, matterResult.data),
    content: matterResult.content,
    mdxSource,
  };
}
