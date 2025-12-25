import { FaBoxOpen } from "react-icons/fa6";

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: any;
  language: string;
  readmeUrl: string;
}

export const projects: Project[] = [
  {
    id: "ink-scroll-view",
    name: "ink-scroll-view",
    description:
      "A robust ScrollView and ScrollList component for Ink CLI applications.",
    link: "https://github.com/ByteLandTechnology/ink-scroll-view",
    icon: FaBoxOpen,
    language: "TypeScript",
    readmeUrl:
      "https://raw.githubusercontent.com/ByteLandTechnology/ink-scroll-view/main/README.md",
  },
  {
    id: "ink-scroll-list",
    name: "ink-scroll-list",
    description:
      "A high-level ScrollList component for Ink CLI applications, built on top of ink-scroll-view.",
    link: "https://github.com/ByteLandTechnology/ink-scroll-list",
    icon: FaBoxOpen,
    language: "TypeScript",
    readmeUrl:
      "https://raw.githubusercontent.com/ByteLandTechnology/ink-scroll-list/main/README.md",
  },
  {
    id: "ink-scroll-bar",
    name: "ink-scroll-bar",
    description:
      "A customizable, high-precision vertical scroll bar component for Ink CLI applications.",
    link: "https://github.com/ByteLandTechnology/ink-scroll-bar",
    icon: FaBoxOpen,
    language: "TypeScript",
    readmeUrl:
      "https://raw.githubusercontent.com/ByteLandTechnology/ink-scroll-bar/main/README.md",
  },
  {
    id: "ink-multiline-input",
    name: "ink-multiline-input",
    description:
      "A robust multi-line text input component for Ink applications. 🚀",
    link: "https://github.com/ByteLandTechnology/ink-multiline-input",
    icon: FaBoxOpen,
    language: "TypeScript",
    readmeUrl:
      "https://raw.githubusercontent.com/ByteLandTechnology/ink-multiline-input/main/README.md",
  },
  {
    id: "ink-canvas",
    name: "ink-canvas",
    description: "A library for rendering Ink applications in the browser.",
    link: "https://github.com/ByteLandTechnology/ink-canvas",
    icon: FaBoxOpen,
    language: "TypeScript",
    readmeUrl:
      "https://raw.githubusercontent.com/ByteLandTechnology/ink-canvas/main/README.md",
  },
  {
    id: "jules-api-node",
    name: "jules-api-node",
    description: "The unofficial TypeScript client for the Jules API.",
    link: "https://github.com/ByteLandTechnology/jules-api-node",
    icon: FaBoxOpen,
    language: "TypeScript",
    readmeUrl:
      "https://raw.githubusercontent.com/ByteLandTechnology/jules-api-node/main/README.md",
  },
];
