import { motion } from "framer-motion";
import { FaCode, FaChevronRight, FaGlobe } from "react-icons/fa6";
import Link from "next/link";
import Page from "../../components/Page";
import { FooterConfig } from "../../components/Footer";
import { projects } from "../../config/projects";

export default function OpenLand() {
  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "OpenLand",
      description: "Building the future, together.",
      icon: "/assets/images/openland-icon.svg",
    },

    socials: true,
  };

  return (
    <Page footerConfig={footerConfig}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <img
                src="/assets/images/openland-icon.svg"
                alt="Open Source Icon"
                className="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Welcome to <span className="text-gradient-tri">OpenLand</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Our playground for open source contributions. Exploring code,
              sharing knowledge, and building tools for the community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-rgb-blue hover:shadow-lg transition-all group flex flex-col h-full relative"
              >
                <Link
                  href={`/opensource/${project.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project.name} details`}
                ></Link>

                <div className="flex items-center gap-3 relative z-20">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-rgb-blue/10 group-hover:text-rgb-blue transition-colors">
                    <project.icon className="w-6 h-6" />
                  </div>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-rgb-blue hover:text-white transition-all pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${project.name} homepage`}
                    >
                      <FaGlobe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-rgb-blue transition-colors">
                    {project.name}
                  </h3>
                  <FaChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rgb-blue group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-slate-600 mb-6 flex-1">
                  {project.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <FaCode className="w-4 h-4" />
                    <span>{project.language}</span>
                  </div>
                  {/* Optional: Add more stats if available in data */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
