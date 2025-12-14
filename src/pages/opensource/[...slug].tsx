import { motion } from "framer-motion";
import {
  FaTriangleExclamation,
  FaArrowLeft,
  FaUpRightFromSquare,
  FaCode,
} from "react-icons/fa6";
import Page from "../../components/Page";
import { FooterConfig } from "../../components/Footer";
import { projects, Project } from "../../config/projects";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = projects.map((project) => ({
    params: { slug: [project.id] },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[];
  const projectId = slug[0];
  const subPath = slug.slice(1).join("/");

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return { notFound: true };
  }

  const baseRawUrl = project.readmeUrl.substring(
    0,
    project.readmeUrl.lastIndexOf("/"),
  );

  let fetchUrl = project.readmeUrl;
  if (subPath) {
    const cleanSubPath = subPath.startsWith("/")
      ? subPath.substring(1)
      : subPath;
    fetchUrl = `${baseRawUrl}/${cleanSubPath}`;
  }

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    const readmeContent = await response.text();

    return {
      props: {
        projectId,
        readmeContent,
        subPath,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        projectId,
        readmeContent: "",
        subPath,
        error: (error as Error).message,
      },
    };
  }
};

export default function OpenLandProject({
  projectId,
  readmeContent,
  subPath,
  error,
}: {
  projectId: string;
  readmeContent: string;
  subPath: string;
  error?: string;
}) {
  const project = projects.find((p) => p.id === projectId)!;

  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "OpenLand",
      description: "Open Source contributions from ByteLand.",
      icon: "/assets/images/logo.svg",
    },
    socials: true,
  };

  const getRendererProps = () => {
    const baseRawUrl = project.readmeUrl.substring(
      0,
      project.readmeUrl.lastIndexOf("/"),
    );

    let currentDirRel = "";
    if (subPath) {
      const lastSlash = subPath.lastIndexOf("/");
      if (lastSlash !== -1) {
        currentDirRel = subPath.substring(0, lastSlash);
      }
    }

    const currentFileDir = currentDirRel
      ? `${baseRawUrl}/${currentDirRel}`
      : baseRawUrl;

    const repoBlobRoot = baseRawUrl
      .replace("raw.githubusercontent.com", "github.com")
      .replace(/\/([^/]+)\/([^/]+)\/([^/]+)/, "/$1/$2/blob/$3");

    const currentLinkBase = currentDirRel
      ? `${repoBlobRoot}/${currentDirRel}`
      : repoBlobRoot;

    const currentRouteBase = currentDirRel
      ? `/opensource/${project.id}/${currentDirRel}`
      : `/opensource/${project.id}`;

    return {
      basePath: currentFileDir,
      linkBasePath: currentLinkBase,
      routeBase: currentRouteBase,
    };
  };

  const rendererProps = getRendererProps();

  return (
    <Page footerConfig={footerConfig} className="bg-white">
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/opensource"
            className="inline-flex items-center text-slate-500 hover:text-rgb-blue mb-8 transition-colors"
          >
            <FaArrowLeft className="mr-2 w-4 h-4" />
            Back to Open Source
          </Link>

          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Project Header */}
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-rgb-blue">
                  <project.icon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1.5 text-sm font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
                      <FaCode className="w-3.5 h-3.5" />
                      {project.language}
                    </div>
                  </div>
                </div>
              </div>

              {!subPath && (
                <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                  {project.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-rgb-blue transition-colors"
                >
                  View on GitHub
                  <FaUpRightFromSquare className="ml-2 w-4 h-4" />
                </a>
              </div>
            </header>

            <div className="h-px bg-slate-200 w-full mb-12"></div>

            {error ? (
              <div className="flex flex-col items-center justify-center py-16 text-red-600">
                <FaTriangleExclamation className="w-8 h-8 mb-2" />
                <p>Failed to load content: {error}</p>
              </div>
            ) : (
              <MarkdownRenderer
                content={readmeContent}
                basePath={rendererProps.basePath}
                linkBasePath={rendererProps.linkBasePath}
                routeBase={rendererProps.routeBase}
              />
            )}
          </motion.article>
        </div>
      </div>
    </Page>
  );
}
