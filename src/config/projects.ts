export type Category = "layout" | "tinky" | "ink" | "reverse-engineering";

export interface Project {
  id: string;
  name: string;
  /** Short line for cards (≤ 60 chars). */
  tagline: string;
  description: string;
  category: Category;
  language: string;
  /** GitHub repository in "owner/name" form. */
  repo: string;
  featured?: boolean;
  /** Shell command shown on cards and in the project sidebar. */
  install?: string;
  homepage?: string;
  tags?: string[];
}

export interface CategoryInfo {
  id: Category;
  title: string;
  /** One line for section headers. */
  blurb: string;
}

export const categories: CategoryInfo[] = [
  {
    id: "layout",
    title: "Layout Engine",
    blurb: "CSS layout algorithms for any JavaScript runtime.",
  },
  {
    id: "tinky",
    title: "Tinky Framework",
    blurb: "React for CLIs, laid out by Taffy.",
  },
  {
    id: "ink",
    title: "Ink Components",
    blurb: "Components for rich terminal UIs built with Ink.",
  },
  {
    id: "reverse-engineering",
    title: "Reverse Engineering",
    blurb: "Ghidra, opened up to agents and automation.",
  },
];

export const projects: Project[] = [
  {
    id: "taffy-layout",
    name: "taffy-layout",
    tagline: "Flexbox & Grid layout, compiled to WebAssembly",
    description:
      "High-performance WebAssembly bindings for the Taffy layout engine, bringing CSS Flexbox and Grid to JavaScript with near-native performance.",
    category: "layout",
    language: "TypeScript",
    repo: "ByteLandTechnology/taffy-layout",
    featured: true,
    install: "npm install taffy-layout",
    tags: ["wasm", "flexbox", "grid"],
  },
  {
    id: "tinky",
    name: "tinky",
    tagline: "React for CLIs, with Flexbox and Grid",
    description:
      "A React-based framework for building interactive command-line interfaces, using the Taffy layout engine for CSS Flexbox and Grid.",
    category: "tinky",
    language: "TypeScript",
    repo: "ByteLandTechnology/tinky",
    featured: true,
    install: "npm install tinky react",
    tags: ["react", "tui", "taffy"],
  },
  {
    id: "ink-scroll-view",
    name: "ink-scroll-view",
    tagline: "Scrollable viewports for Ink terminal apps",
    description:
      "A robust ScrollView component for Ink CLI applications, with programmatic scrolling and auto-scroll alignment.",
    category: "ink",
    language: "TypeScript",
    repo: "ByteLandTechnology/ink-scroll-view",
    featured: true,
    install: "npm install ink-scroll-view",
    homepage: "https://ink-scroll-view.byteland.app",
    tags: ["ink", "tui", "react"],
  },
  {
    id: "ink-scroll-list",
    name: "ink-scroll-list",
    tagline: "Keyboard-driven scrolling lists for Ink",
    description:
      "A high-level ScrollList component for Ink CLI applications, built on top of ink-scroll-view.",
    category: "ink",
    language: "TypeScript",
    repo: "ByteLandTechnology/ink-scroll-list",
    install: "npm install ink-scroll-list",
    homepage: "https://ink-scroll-list.byteland.app",
    tags: ["ink", "tui", "react"],
  },
  {
    id: "ink-scroll-bar",
    name: "ink-scroll-bar",
    tagline: "Precise vertical scroll bars for Ink",
    description:
      "A customizable, high-precision vertical scroll bar component for Ink CLI applications.",
    category: "ink",
    language: "TypeScript",
    repo: "ByteLandTechnology/ink-scroll-bar",
    install: "npm install @byteland/ink-scroll-bar",
    tags: ["ink", "tui", "react"],
  },
  {
    id: "ink-multiline-input",
    name: "ink-multiline-input",
    tagline: "Multi-line text input for Ink",
    description:
      "A robust multi-line text input component for Ink applications.",
    category: "ink",
    language: "TypeScript",
    repo: "ByteLandTechnology/ink-multiline-input",
    install: "npm install ink-multiline-input",
    tags: ["ink", "tui", "input"],
  },
  {
    id: "ink-canvas",
    name: "ink-canvas",
    tagline: "Run Ink apps in the browser with Xterm.js",
    description:
      "Render Ink applications in the browser with Xterm.js: custom streams, Node.js mocks and a Vite plugin.",
    category: "ink",
    language: "TypeScript",
    repo: "ByteLandTechnology/ink-canvas",
    install: "npm install ink-canvas",
    homepage: "https://ink-canvas.byteland.app",
    tags: ["ink", "xterm", "browser"],
  },
  {
    id: "ghidra-bridge",
    name: "ghidra-bridge",
    tagline: "Drive Ghidra over MCP and JSON-RPC",
    description:
      "Network access to an active Ghidra program over WebSocket JSON-RPC 2.0 and MCP Streamable HTTP, with zero third-party dependencies.",
    category: "reverse-engineering",
    language: "Java",
    repo: "ByteLandTechnology/ghidra-bridge",
    featured: true,
    install: "./gradlew buildGhidraScript",
    tags: ["ghidra", "mcp", "json-rpc"],
  },
  {
    id: "headless-ghidra",
    name: "headless-ghidra",
    tagline: "Agent skills for phased binary analysis",
    description:
      "A Ghidra reverse-engineering skill family for agents, with phased analysis pipelines and Markdown outputs.",
    category: "reverse-engineering",
    language: "Rust",
    repo: "ByteLandTechnology/headless-ghidra",
    install:
      "npx skills add https://github.com/ByteLandTechnology/headless-ghidra --all",
    tags: ["ghidra", "agent-skills"],
  },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  Java: "#b07219",
  Rust: "#dea584",
};

export const getRepoUrl = (project: Project) =>
  `https://github.com/${project.repo}`;

export const getReadmeUrl = (project: Project) =>
  `https://raw.githubusercontent.com/${project.repo}/HEAD/README.md`;

export const getProject = (id: string) => projects.find((p) => p.id === id);

export const getCategory = (id: Category) =>
  categories.find((c) => c.id === id)!;

export const getProjectsByCategory = (id: Category) =>
  projects.filter((p) => p.category === id);
