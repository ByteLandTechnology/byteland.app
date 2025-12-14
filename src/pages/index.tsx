import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa6";
import Link from "next/link";
import Page from "../components/Page";
import { FooterConfig } from "../components/Footer";

export default function Home() {
  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "ByteLand",
      description: "Innovating for your everyday life.",
      icon: "/assets/images/logo.svg",
    },
    socials: true,
  };

  return (
    <Page footerConfig={footerConfig}>
      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        {/* Animated Tri-color Background Blobs */}
        <div className="absolute -z-20 top-0 left-1/4 w-72 h-72 bg-rgb-red/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite]"></div>
        <div className="absolute -z-20 top-0 right-1/4 w-72 h-72 bg-rgb-green/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite_2s]"></div>
        <div className="absolute -z-20 -bottom-8 left-1/3 w-72 h-72 bg-rgb-blue/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite_4s]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Smart Apps for
              <div className="mt-2 pb-6 leading-tight">
                <span className="inline-block text-gradient-tri">
                  Everyday Life
                </span>
              </div>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              ByteLand Technology Limited creates innovative cross-platform
              applications for mobile and web. From developer tools to daily
              utilities, we build experiences that matter.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#products"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-tri text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
              >
                Explore Products
                <FaChevronRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Our Products
            </h2>
            <p className="text-slate-600">
              Innovations we are bringing to the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* JulesGo Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col relative group"
            >
              {/* Tri-color Accent Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-tri"></div>
              <Link
                href="/jules-go"
                className="h-48 relative overflow-hidden flex items-center justify-center cursor-pointer"
              >
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                {/* Animated Blobs */}
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-rgb-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite]"></div>
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-rgb-green/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite_2s]"></div>
                {/* Status Badge */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rgb-green text-white text-xs font-bold shadow-lg z-20">
                  Available Now
                </span>
                {/* JulesGo Animated Icon */}
                <motion.img
                  src="/assets/images/julesgo-icon.svg"
                  alt="Jules GO Ghost"
                  className="w-24 h-24 drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
              <div className="p-8 flex-1 flex flex-col">
                <Link
                  href="/jules-go"
                  className="flex items-center gap-2 mb-4 group/title hover:gap-3 transition-all cursor-pointer"
                >
                  <motion.h3 className="text-2xl font-extrabold tracking-tight font-brand text-gradient-tri">
                    Jules GO
                  </motion.h3>
                  <FaChevronRight className="w-5 h-5 shrink-0 translate-y-0.5 text-slate-400 group-hover/title:text-rgb-red group-hover/title:translate-x-1 transition-all" />
                </Link>
                <p className="text-slate-600 mb-6 flex-1">
                  Your intelligent pair programmer on the go. A mobile client
                  for Google's Jules API that lets you chat with your code,
                  manage coding sessions, and secure your API keys locally.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-green"></div>
                    AI Collaboration with Google Jules API
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-green"></div>
                    Secure Local Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-green"></div>
                    PWA Available (Mobile Apps Coming Soon)
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Seelist Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col relative group"
            >
              {/* Tri-color Accent Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-tri"></div>
              <Link
                href="/seelist"
                className="h-48 relative overflow-hidden flex items-center justify-center cursor-pointer"
              >
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                {/* Animated Blobs */}
                <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-rgb-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite_4s]"></div>
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-rgb-red/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite]"></div>
                {/* Status Badge */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-500 text-white text-xs font-bold shadow-lg z-20">
                  Coming Soon
                </span>
                {/* Seelist Icon */}
                <motion.img
                  src="/assets/images/seelist-icon.svg"
                  alt="Seelist Icon"
                  className="w-24 h-24 drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
              <div className="p-8 flex-1 flex flex-col">
                <Link
                  href="/seelist"
                  className="flex items-center gap-2 mb-4 group/title hover:gap-3 transition-all cursor-pointer"
                >
                  <motion.h3 className="text-2xl font-extrabold tracking-tight font-brand text-gradient-tri">
                    Seelist
                  </motion.h3>
                  <FaChevronRight className="w-5 h-5 shrink-0 translate-y-0.5 text-slate-400 group-hover/title:text-rgb-blue group-hover/title:translate-x-1 transition-all" />
                </Link>
                <p className="text-slate-600 mb-6 flex-1">
                  Your personal movie and TV show tracker. Browse the TMDB
                  library, watch trailers, and manage your watchlist with your
                  own API key.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-blue"></div>
                    Powered by TMDB API
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-blue"></div>
                    Watch Trailers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-blue"></div>
                    Local Favorites Collection
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* JoyDex Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col relative group"
            >
              {/* Tri-color Accent Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-tri"></div>
              <Link
                href="/joydex"
                className="h-48 relative overflow-hidden flex items-center justify-center cursor-pointer"
              >
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                {/* Animated Blobs */}
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-rgb-red/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite]"></div>
                <div className="absolute -bottom-8 right-1/4 w-32 h-32 bg-rgb-green/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_10s_infinite_2s]"></div>
                {/* Status Badge */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rgb-red text-white text-xs font-bold shadow-lg z-20">
                  New
                </span>
                {/* JoyDex Icon */}
                <motion.img
                  src="/assets/images/joydex-icon.svg"
                  alt="JoyDex Icon"
                  className="w-24 h-24 drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
              <div className="p-8 flex-1 flex flex-col">
                <Link
                  href="/joydex"
                  className="flex items-center gap-2 mb-4 group/title hover:gap-3 transition-all cursor-pointer"
                >
                  <motion.h3 className="text-2xl font-extrabold tracking-tight font-brand text-gradient-tri">
                    JoyDex
                  </motion.h3>
                  <FaChevronRight className="w-5 h-5 shrink-0 translate-y-0.5 text-slate-400 group-hover/title:text-rgb-red group-hover/title:translate-x-1 transition-all" />
                </Link>
                <p className="text-slate-600 mb-6 flex-1">
                  The ultimate companion for Pokémon trainers. Comprehensive
                  database, team builder, and a joyful interface to track your
                  journey.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-red"></div>
                    Gen 1-9 Complete Data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rgb-red"></div>
                    Smart Team Builder
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact/Footer */}
    </Page>
  );
}
