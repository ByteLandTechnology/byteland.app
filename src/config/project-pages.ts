/**
 * Content for each project's showcase page, written from the facts in the
 * project's README. Kept free of React imports so the Remotion videos in
 * /video can read it too.
 */

export type HighlightIcon =
  | "bolt"
  | "layers"
  | "grid"
  | "ruler"
  | "code"
  | "keyboard"
  | "scroll"
  | "focus"
  | "palette"
  | "mask"
  | "browser"
  | "plug"
  | "shield"
  | "graph"
  | "robot"
  | "file"
  | "refresh"
  | "anchor"
  | "terminal";

export interface Highlight {
  icon: HighlightIcon;
  title: string;
  body: string;
}

export interface ProjectPage {
  /** One sentence under the project name. */
  headline: string;
  highlights: Highlight[];
  code: { lang: string; title: string; code: string };
  /** A real sequence of steps, shown as a numbered flow. */
  steps?: { title: string; body: string }[];
  /** Package groups for frameworks with an ecosystem. */
  ecosystem?: { title: string; packages: string[] }[];
}

export const projectPages: Record<string, ProjectPage> = {
  "taffy-layout": {
    headline:
      "The Taffy layout engine in WebAssembly: Flexbox, Grid and Block layout for JavaScript.",
    highlights: [
      {
        icon: "bolt",
        title: "WebAssembly speed",
        body: "Layout runs in compiled Rust, not JavaScript.",
      },
      {
        icon: "grid",
        title: "Flexbox, Grid & Block",
        body: "CSS layout algorithms, including floats.",
      },
      {
        icon: "ruler",
        title: "Custom measurement",
        body: "Measure text and content with your own callback.",
      },
      {
        icon: "code",
        title: "TypeScript ready",
        body: "Complete type definitions and CSS-like names.",
      },
    ],
    code: {
      lang: "typescript",
      title: "layout.ts",
      code: `import { loadTaffy, TaffyTree, Style, Display, FlexDirection } from "taffy-layout";

await loadTaffy();
const tree = new TaffyTree();

const container = new Style();
container.display = Display.Flex;
container.flexDirection = FlexDirection.Column;
container.size = { width: 300, height: 200 };

const child = new Style();
child.flexGrow = 1;

const a = tree.newLeaf(child);
const b = tree.newLeaf(child);
const root = tree.newWithChildren(container, [a, b]);

tree.computeLayout(root, { width: 300, height: 200 });
console.log(tree.getLayout(a)); // { x, y, width, height }`,
    },
  },

  tinky: {
    headline:
      "Build command-line interfaces with React components, laid out by the Taffy engine.",
    highlights: [
      {
        icon: "code",
        title: "React components",
        body: "Familiar JSX patterns for terminal apps.",
      },
      {
        icon: "grid",
        title: "Flexbox & Grid",
        body: "Full CSS Flexbox and Grid, powered by Taffy.",
      },
      {
        icon: "focus",
        title: "Input & focus",
        body: "Keyboard hooks and Tab / Shift+Tab focus.",
      },
      {
        icon: "palette",
        title: "Rich styling",
        body: "Borders, backgrounds, colors and ARIA support.",
      },
    ],
    code: {
      lang: "tsx",
      title: "app.tsx",
      code: `import { render, Box, Text } from "tinky";

function App() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="green" bold>
        Hello, Tinky!
      </Text>
      <Text>Build beautiful CLIs with React</Text>
    </Box>
  );
}

render(<App />);`,
    },
    ecosystem: [
      {
        title: "Input",
        packages: [
          "tinky-text-input",
          "tinky-email-input",
          "tinky-confirm-input",
          "tinky-select",
          "tinky-multi-select",
        ],
      },
      {
        title: "Display",
        packages: [
          "tinky-table",
          "tinky-badge",
          "tinky-alert",
          "tinky-spinner",
          "tinky-progress-bar",
          "tinky-status-message",
          "tinky-ordered-list",
          "tinky-unordered-list",
          "tinky-figures",
          "tinky-link",
          "tinky-image",
        ],
      },
      {
        title: "Platform",
        packages: [
          "tinky-web",
          "tinky-theme",
          "tinky-keypress",
          "tinky-mouse",
          "tinky-termcap",
          "tinky-test",
        ],
      },
    ],
  },

  "ink-scroll-view": {
    headline:
      "A ScrollView for Ink: content taller than the terminal, scrolled under your control.",
    highlights: [
      {
        icon: "layers",
        title: "Flexible container",
        body: "Holds content larger than the viewport.",
      },
      {
        icon: "ruler",
        title: "Auto-measurement",
        body: "Measures child heights for you.",
      },
      {
        icon: "refresh",
        title: "Dynamic content",
        body: "Add, remove, expand and collapse items live.",
      },
      {
        icon: "anchor",
        title: "Layout stability",
        body: "Keeps scroll position when content changes.",
      },
    ],
    code: {
      lang: "tsx",
      title: "scroll.tsx",
      code: `import { useRef } from "react";
import { render, Text, Box, useInput } from "ink";
import { ScrollView, ScrollViewRef } from "ink-scroll-view";

const App = () => {
  const scrollRef = useRef<ScrollViewRef>(null);

  useInput((input, key) => {
    if (key.upArrow) scrollRef.current?.scrollBy(-1);
    if (key.downArrow) scrollRef.current?.scrollBy(1);
  });

  return (
    <Box height={10} borderStyle="single" flexDirection="column">
      <ScrollView ref={scrollRef}>
        {Array.from({ length: 50 }).map((_, i) => (
          <Text key={i}>Item {i + 1}</Text>
        ))}
      </ScrollView>
    </Box>
  );
};

render(<App />);`,
    },
  },

  "ink-scroll-list": {
    headline:
      "A selectable list for Ink that scrolls to keep the selected item in view.",
    highlights: [
      {
        icon: "keyboard",
        title: "Controlled selection",
        body: "The parent owns selectedIndex.",
      },
      {
        icon: "scroll",
        title: "Auto-scrolling",
        body: "The selected item always stays visible.",
      },
      {
        icon: "anchor",
        title: "Alignment modes",
        body: "auto, top, bottom or center.",
      },
      {
        icon: "bolt",
        title: "Efficient",
        body: "Tracks selection without full re-layouts.",
      },
    ],
    code: {
      lang: "tsx",
      title: "list.tsx",
      code: `import { useState } from "react";
import { render, Text, Box, useInput } from "ink";
import { ScrollList } from "ink-scroll-list";

const items = Array.from({ length: 20 }, (_, i) => \`Item \${i + 1}\`);

const App = () => {
  const [selected, setSelected] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) setSelected((i) => Math.max(i - 1, 0));
    if (key.downArrow) setSelected((i) => Math.min(i + 1, items.length - 1));
  });

  return (
    <Box borderStyle="single" height={10}>
      <ScrollList selectedIndex={selected}>
        {items.map((item, i) => (
          <Text key={i} color={i === selected ? "green" : "white"}>
            {i === selected ? "> " : "  "}
            {item}
          </Text>
        ))}
      </ScrollList>
    </Box>
  );
};

render(<App />);`,
    },
  },

  "ink-scroll-bar": {
    headline:
      "High-precision vertical scroll bars for Ink, in the border or inside the content.",
    highlights: [
      {
        icon: "layers",
        title: "Border & inset modes",
        body: "Replace a border side or float inside.",
      },
      {
        icon: "palette",
        title: "Rich styling",
        body: "Ink border styles plus block, line, thick and dots.",
      },
      {
        icon: "plug",
        title: "Drop-in wrapper",
        body: "ScrollBarBox gives you a bordered box instantly.",
      },
      {
        icon: "mask",
        title: "Auto-hide",
        body: "Hides itself when the content fits.",
      },
    ],
    code: {
      lang: "tsx",
      title: "scroll-bar.tsx",
      code: `import { useState } from "react";
import { Text } from "ink";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";

const MyComponent = () => {
  const [offset, setOffset] = useState(0);

  return (
    <ScrollBarBox
      height={12}
      width={40}
      borderStyle="single"
      scrollBarPosition="right"
      contentHeight={50}
      viewportHeight={10}
      scrollOffset={offset}
    >
      <Text>Item 1...</Text>
    </ScrollBarBox>
  );
};`,
    },
  },

  "ink-multiline-input": {
    headline:
      "Multi-line text input for Ink, with cursor navigation, editing and scrolling.",
    highlights: [
      {
        icon: "scroll",
        title: "Vertical scrolling",
        body: "Keeps the cursor in view as you type.",
      },
      {
        icon: "keyboard",
        title: "Cursor navigation",
        body: "Arrow keys, Backspace and Delete.",
      },
      {
        icon: "palette",
        title: "Line highlight",
        body: "Style the active line with highlightStyle.",
      },
      {
        icon: "mask",
        title: "Masking",
        body: "Hide input with a mask character.",
      },
    ],
    code: {
      lang: "tsx",
      title: "input.tsx",
      code: `import { useState } from "react";
import { render, Box } from "ink";
import { MultilineInput } from "ink-multiline-input";

const App = () => {
  const [value, setValue] = useState("");

  return (
    <Box padding={1}>
      <MultilineInput
        value={value}
        onChange={setValue}
        rows={3}
        maxRows={10}
        placeholder="Type something here..."
        highlightStyle={{ backgroundColor: "blue" }}
        onSubmit={(val) => console.log("Submitted:", val)}
        keyBindings={{ submit: (key) => key.ctrl && key.return }}
      />
    </Box>
  );
};

render(<App />);`,
    },
  },

  "ink-canvas": {
    headline: "Run Ink applications in the browser, rendered by Xterm.js.",
    highlights: [
      {
        icon: "browser",
        title: "Ink in the browser",
        body: "No Node.js process needed.",
      },
      {
        icon: "terminal",
        title: "Xterm.js rendering",
        body: "Real terminal styling, resizing and fit.",
      },
      {
        icon: "keyboard",
        title: "Input handling",
        body: "Browser keystrokes are forwarded to Ink.",
      },
      {
        icon: "plug",
        title: "Vite plugin",
        body: "Polyfills configured automatically.",
      },
    ],
    code: {
      lang: "tsx",
      title: "App.tsx",
      code: `import { Text, Box } from "ink";
import { InkCanvas } from "ink-canvas";

const MyInkApp = () => (
  <Box borderStyle="round" borderColor="green">
    <Text>Hello from Ink in the Browser!</Text>
  </Box>
);

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <InkCanvas focused terminalOptions={{ fontSize: 14 }}>
        <MyInkApp />
      </InkCanvas>
    </div>
  );
}`,
    },
  },

  "ghidra-bridge": {
    headline:
      "Network access to a running Ghidra program, over WebSocket JSON-RPC 2.0 and MCP.",
    highlights: [
      {
        icon: "plug",
        title: "Two transports",
        body: "WebSocket JSON-RPC 2.0 and MCP Streamable HTTP.",
      },
      {
        icon: "graph",
        title: "53 typed methods",
        body: "One catalog, from interface.get to batch.execute.",
      },
      {
        icon: "refresh",
        title: "Atomic batches",
        body: "Batch operations roll back on error.",
      },
      {
        icon: "shield",
        title: "Secure by default",
        body: "Loopback binding and bearer tokens.",
      },
    ],
    code: {
      lang: "json",
      title: "MCP tool call",
      code: `{
  "name": "ghidra.program",
  "arguments": {
    "operation": "get",
    "params": {}
  }
}`,
    },
    steps: [
      {
        title: "Build",
        body: "./gradlew buildGhidraScript produces the scripts and a zero-dependency JAR.",
      },
      {
        title: "Start",
        body: "Run Bridge.java or GhidraMcp.java in the GUI or as a headless post-script.",
      },
      {
        title: "Connect",
        body: "Point a WebSocket client or MCP agent at the bridge.",
      },
    ],
  },

  "headless-ghidra": {
    headline:
      "A Ghidra reverse-engineering skill family that takes agents from intake to decompilation.",
    highlights: [
      {
        icon: "robot",
        title: "Built for agents",
        body: "Install the skills, then ask your agent.",
      },
      {
        icon: "layers",
        title: "Phase gates",
        body: "Stop after each phase to review artifacts.",
      },
      {
        icon: "file",
        title: "Markdown outputs",
        body: "Every phase leaves reviewable artifacts.",
      },
      {
        icon: "graph",
        title: "Function deep dives",
        body: "Types, constants and vtables before decompiling.",
      },
    ],
    code: {
      lang: "text",
      title: "Ask your agent",
      code: `Use the headless-ghidra skill to analyze ./sample-target.
Start at P0 intake, choose a stable target id, and stop
after each phase gate so I can review the artifacts.`,
    },
    steps: [
      { title: "P0 Intake", body: "Confirm the target and set scope." },
      { title: "P1 Baseline", body: "Import into Ghidra, export baselines." },
      { title: "P2 Evidence", body: "Identify third-party code." },
      { title: "P3 Discovery", body: "Recover names, types and strings." },
      { title: "P4 Decompile", body: "Apply metadata, decompile functions." },
    ],
  },
};
