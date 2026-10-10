export interface PageConfigItem {
  title: string;
  id: string;
  metaTitle?: string; // Optional full title for document.title
}

export const PAGE_CONFIG: Record<string, PageConfigItem> = {
  "/blog": {
    title: "Blog",
    id: "blog",
    metaTitle: "Blog - ByteLand Technology",
  },
};

export const DEFAULT_TITLE =
  "ByteLand Technology - Open Source for Terminals, Layout & Reverse Engineering";

// Only index pages are matched; detail pages set their own <title>.
export const getPageConfig = (pathname: string): PageConfigItem | null =>
  PAGE_CONFIG[pathname] ?? null;
