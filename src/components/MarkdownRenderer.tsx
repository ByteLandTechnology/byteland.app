import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Mermaid from "./Mermaid";

interface MarkdownRendererProps {
  content: string;
  basePath?: string; // Base path for resolving relative image URLs (Raw content)
  linkBasePath?: string; // Base path for resolving relative file links (Blob content)
  routeBase?: string; // Base route for internal navigation (for .md files)
}

/**
 * Resolves a relative image path to an absolute path based on the markdown file's location.
 * @param src The image source from the markdown.
 * @param basePath The directory path of the markdown file.
 * @returns The resolved absolute path.
 */
function resolveImagePath(
  src: string | undefined,
  basePath?: string,
): string | undefined {
  if (!src) return src;

  // If it's already an absolute path or external URL, return as-is
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  // If we have a basePath and the src is relative (starts with ./)
  if (basePath && src.startsWith("./")) {
    // Remove the leading './' and join with basePath
    const relativeSrc = src.substring(2);
    return `${basePath}/${relativeSrc}`;
  }

  // For other relative paths without './', also resolve using basePath
  if (basePath) {
    return `${basePath}/${src}`;
  }

  return src;
}

// Create components factory that accepts paths
function createMarkdownComponents(
  basePath?: string,
  linkBasePath?: string,
  routeBase?: string,
): object {
  return {
    h1: ({ ...props }) => (
      <h1
        className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-12 mb-6 scroll-mt-20"
        {...props}
      />
    ),
    h2: ({ ...props }) => (
      <h2
        className="text-2xl sm:text-3xl font-bold text-rgb-blue mt-10 mb-4 border-b border-blue-200/50 pb-3 scroll-mt-20"
        {...props}
      />
    ),
    h3: ({ ...props }) => (
      <h3
        className="text-xl sm:text-2xl font-bold text-rgb-green mt-8 mb-4 scroll-mt-20"
        {...props}
      />
    ),
    h4: ({ ...props }) => (
      <h4
        className="text-lg sm:text-xl font-bold text-rgb-red mt-8 mb-4 scroll-mt-20"
        {...props}
      />
    ),
    p: ({ ...props }) => (
      <p className="text-lg text-slate-700 leading-relaxed my-6" {...props} />
    ),
    a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      let finalHref = href;
      let target = props.target;

      if (href && !href.startsWith("http") && !href.startsWith("#")) {
        // Relative link handling
        const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(href);
        const isMarkdown = /\.md$/i.test(href || "");

        // Remove leading ./ if present
        let cleanPath = href.startsWith("./") ? href.substring(2) : href;
        if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

        if (isImage && basePath) {
          // Images use raw base path
          finalHref = `${basePath}/${cleanPath}`;
          target = "_blank";
        } else if (isMarkdown && routeBase) {
          // Markdown files use internal routing if enabled
          const href = `${routeBase}/${cleanPath}`;
          return (
            <Link
              href={href}
              className="text-rgb-blue font-semibold hover:underline hover:text-rgb-red transition-colors"
              {...(props as any)}
            >
              {props.children}
            </Link>
          );
        } else if (linkBasePath) {
          // Other files (like .md) use blob base path
          finalHref = `${linkBasePath}/${cleanPath}`;
          target = "_blank";
        }
      } else if (href && href.startsWith("http")) {
        // External links always new tab
        target = "_blank";
      }

      return (
        <a
          className="text-rgb-blue font-semibold hover:underline hover:text-rgb-red transition-colors"
          href={finalHref}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          {...props}
        />
      );
    },
    ul: ({ ...props }) => (
      <ul
        className="list-disc pl-6 my-6 space-y-3 marker:text-slate-400"
        {...props}
      />
    ),
    ol: ({ ...props }) => (
      <ol
        className="list-decimal pl-6 my-6 space-y-3 marker:text-slate-400"
        {...props}
      />
    ),
    li: ({ ...props }) => <li className="text-lg text-slate-700" {...props} />,
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeContent = String(children).replace(/\n$/, "");

      if (!inline && language === "mermaid") {
        return <Mermaid chart={codeContent} />;
      }

      return !inline && match ? (
        <div className="rounded-xl overflow-hidden my-6 shadow-lg border border-slate-700/50">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: "1.5rem",
              backgroundColor: "#1e1e1e",
              fontSize: "0.9rem",
              lineHeight: "1.5",
            }}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className={`${
            inline
              ? "bg-slate-100 text-rgb-red font-mono text-sm px-1.5 py-0.5 rounded border border-slate-200"
              : className
          }`}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    blockquote: ({ ...props }) => (
      <blockquote
        className="border-l-4 border-rgb-green bg-gradient-to-r from-rgb-green/5 to-transparent p-6 my-6 text-slate-700 italic rounded-r-lg"
        {...props}
      />
    ),
    img: ({ src, alt, ...props }: { src?: string; alt?: string }) => {
      // Detect badge images (shields.io, badge.fury.io, etc.)
      const isBadge =
        src?.includes("shields.io") ||
        src?.includes("badge.fury.io") ||
        src?.includes("badgen.net") ||
        src?.includes("img.shields.io");

      if (isBadge) {
        return (
          <img
            className="inline-block h-5 mr-1"
            src={resolveImagePath(src, basePath)}
            alt={alt}
            {...props}
          />
        );
      }

      return (
        <img
          className="max-w-full h-auto rounded-xl shadow-lg my-8 mx-auto"
          src={resolveImagePath(src, basePath)}
          alt={alt}
          {...props}
        />
      );
    },
    table: ({ ...props }) => (
      <div className="overflow-x-auto my-8 rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200" {...props} />
      </div>
    ),
    thead: ({ ...props }) => <thead className="bg-slate-50" {...props} />,
    th: ({ ...props }) => (
      <th
        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
        {...props}
      />
    ),
    tbody: ({ ...props }) => (
      <tbody className="bg-white divide-y divide-slate-200" {...props} />
    ),
    tr: ({ ...props }) => (
      <tr className="hover:bg-slate-50 transition-colors" {...props} />
    ),
    td: ({ ...props }) => (
      <td
        className="px-6 py-4 whitespace-nowrap text-sm text-slate-600"
        {...props}
      />
    ),
    hr: ({ ...props }) => <hr className="my-12 border-slate-200" {...props} />,
  };
}

export default function MarkdownRenderer({
  content,
  basePath,
  linkBasePath,
  routeBase,
}: MarkdownRendererProps) {
  const components = createMarkdownComponents(
    basePath,
    linkBasePath,
    routeBase,
  );

  return (
    <div className="prose prose-lg prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
