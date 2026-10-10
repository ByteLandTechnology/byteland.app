const fs = require("fs");
const path = require("path");

const matter = require("gray-matter");

// Mirrors isPublished() in src/lib/blog.ts: skip drafts and future-dated posts.
const isPublished = (data) => {
  if (data.draft) return false;
  if (!data.date) return true;
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date).slice(0, 10);
  return date <= new Date().toISOString().slice(0, 10);
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://byteland.app",
  generateRobotsTxt: true,
  outDir: "out",
  generateIndexSitemap: false,
  sitemapSize: 7000,
  // /opensource only redirects to /#projects.
  exclude: ["/404", "/opensource"],

  additionalPaths: async (config) => {
    const result = [];

    // 1. Blog Posts
    const postsDirectory = path.join(__dirname, "public", "posts");

    function getAllMarkdownFiles(dir, baseDir = "") {
      if (!fs.existsSync(dir)) return;
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          getAllMarkdownFiles(fullPath, baseDir ? `${baseDir}/${item}` : item);
        } else if (item.endsWith(".md")) {
          const slug = baseDir
            ? `${baseDir}/${item.replace(/\.md$/, "")}`
            : item.replace(/\.md$/, "");

          const fileContents = fs.readFileSync(fullPath, "utf8");
          const { data } = matter(fileContents);
          if (!isPublished(data)) continue;

          result.push({
            loc: `/blog/${slug}`,
            changefreq: "daily",
            priority: 0.7,
            lastmod: data.date
              ? new Date(data.date).toISOString()
              : stat.mtime.toISOString(),
          });
        }
      }
    }
    getAllMarkdownFiles(postsDirectory);

    // 2. Open Source Projects
    // Read src/config/projects.ts and extract IDs
    const projectsConfigPath = path.join(
      __dirname,
      "src",
      "config",
      "projects.ts",
    );
    if (fs.existsSync(projectsConfigPath)) {
      // Only scan the projects array; categories also carry `id` fields.
      const source = fs.readFileSync(projectsConfigPath, "utf8");
      const content = source.slice(source.indexOf("export const projects"));
      // Regex to find id: "..."
      const idRegex = /id:\s*["']([^"']+)["']/g;
      let match;
      while ((match = idRegex.exec(content)) !== null) {
        const id = match[1];
        result.push({
          loc: `/opensource/${id}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    }

    return result;
  },
};
