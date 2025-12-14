export interface PageConfigItem {
  title: string;
  icon: string;
  color: string;
  id: string;
  metaTitle?: string; // Optional full title for document.title
}

export const PAGE_CONFIG: Record<string, PageConfigItem> = {
  "/jules-go": {
    title: "Jules GO",
    icon: "/assets/images/julesgo-icon.svg",
    color: "text-gradient-tri",
    id: "jules-go",
    metaTitle: "Jules GO - AI Pair Programmer",
  },
  "/seelist": {
    title: "Seelist",
    icon: "/assets/images/seelist-icon.svg",
    color: "text-gradient-tri",
    id: "seelist",
    metaTitle: "Seelist - Movie & Show Tracker",
  },
  "/joydex": {
    title: "JoyDex",
    icon: "/assets/images/joydex-icon.svg",
    color: "text-gradient-tri",
    id: "joydex",
    metaTitle: "JoyDex - Pokémon Companion",
  },
  "/opensource": {
    title: "OpenLand",
    icon: "/assets/images/openland-icon.svg",
    color: "text-gradient-tri",
    id: "opensource",
    metaTitle: "OpenLand - Open Source Projects",
  },
  "/blog": {
    title: "ByteLog",
    icon: "/assets/images/bytelog-icon.svg",
    color: "text-gradient-tri",
    id: "bytelog",
    metaTitle: "ByteLog - ByteLand Blog",
  },
  "/about": {
    title: "About",
    icon: "/assets/images/logo.svg",
    color: "text-gradient-tri",
    id: "about",
    metaTitle: "About - ByteLand Technology",
  },
};

export const DEFAULT_TITLE =
  "ByteLand Technology - Smart Apps for Everyday Life";

export const getPageConfig = (pathname: string): PageConfigItem | null => {
  if (PAGE_CONFIG[pathname]) return PAGE_CONFIG[pathname];

  if (pathname.startsWith("/blog")) return PAGE_CONFIG["/blog"];
  if (pathname.startsWith("/opensource")) return PAGE_CONFIG["/opensource"];

  return null;
};
