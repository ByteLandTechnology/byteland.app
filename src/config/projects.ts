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
];
