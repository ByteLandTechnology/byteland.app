import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  author: string;
  mdxSource: MDXRemoteSerializeResult;
  content: string; // Keep raw content just in case
}

const postsDirectory = path.join(process.cwd(), "public", "posts");

export function getSortedPostsData(): Omit<Post, "content" | "mdxSource">[] {
  // Get all markdown files recursively under /posts
  const allPostsData: Omit<Post, "content" | "mdxSource">[] = [];

  function getAllMarkdownFiles(dir: string, baseDir = ""): void {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        getAllMarkdownFiles(fullPath, baseDir ? `${baseDir}/${item}` : item);
      } else if (item.endsWith(".md")) {
        // Read markdown file as string
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Use relative path as slug with format: year-month/title
        const slug = baseDir
          ? `${baseDir}/${item.replace(/\.md$/, "")}`
          : item.replace(/\.md$/, "");

        // Combine the data with the slug (override slug from frontmatter)
        const postData = matterResult.data as {
          title: string;
          date: string;
          tags: string[];
          author: string;
          slug?: string;
        };

        allPostsData.push({
          slug, // Always use the generated slug
          title: postData.title,
          date: postData.date,
          tags: postData.tags,
          author: postData.author,
        });
      }
    }
  }

  getAllMarkdownFiles(postsDirectory);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const allSlugs: { params: { slug: string[] } }[] = [];

  function getAllMarkdownFiles(dir: string, baseDir = ""): void {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        getAllMarkdownFiles(fullPath, baseDir ? `${baseDir}/${item}` : item);
      } else if (item.endsWith(".md")) {
        // Use relative path as slug array for catch-all route: ['year-month', 'title']
        const fileName = item.replace(/\.md$/, "");
        const slugArray = baseDir ? [baseDir, fileName] : [fileName];
        allSlugs.push({
          params: { slug: slugArray },
        });
      }
    }
  }

  getAllMarkdownFiles(postsDirectory);
  return allSlugs;
}

export async function getPostData(slug: string): Promise<Post> {
  // slug is now in format: 'year-month/title' (e.g., '2025-12/hello-byteland')
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const mdxSource = await serialize(matterResult.content);

  // Combine the data with the slug and content
  // Note: Put slug after spread to ensure our generated slug overrides any slug from frontmatter
  return {
    content: matterResult.content,
    mdxSource,
    ...(matterResult.data as {
      title: string;
      date: string;
      tags: string[];
      author: string;
    }),
    slug, // Must be after spread to override frontmatter slug
  };
}
