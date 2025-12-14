import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWandMagicSparkles,
  FaBrain,
  FaNetworkWired,
  FaMessage,
  FaShieldHalved,
  FaMoon,
  FaSun,
  FaKey,
  FaCode,
  FaCodeBranch,
  FaPlus,
  FaClock,
  FaRobot,
  FaFileCode,
} from "react-icons/fa6";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Page from "../components/Page";
import { FooterConfig } from "../components/Footer";

// Feature Data mapping to screens
const FEATURES = [
  {
    id: "setup",
    label: "Easy Setup",
    icon: FaKey,
    screen: "setup",
    description: "Get started in seconds with your API key.",
  },
  {
    id: "sources",
    label: "Repository",
    icon: FaCodeBranch,
    screen: "sources",
    description: "Browse your repositories and branches.",
  },
  {
    id: "new-session",
    label: "New Session",
    icon: FaPlus,
    screen: "new-session",
    description: "Start a new coding task with ease.",
  },
  {
    id: "sessions",
    label: "Session History",
    icon: FaClock,
    screen: "sessions",
    description: "Track and resume your coding sessions.",
  },
  {
    id: "chat",
    label: "AI Assistant",
    icon: FaRobot,
    screen: "chat",
    description: "Chat naturally with context-aware AI.",
  },
  {
    id: "changes",
    label: "Track Changes",
    icon: FaFileCode,
    screen: "changes",
    description: "Review file modifications in real-time.",
  },
  {
    id: "code",
    label: "Code Review",
    icon: FaCode,
    screen: "code",
    description: "Track and review AI-generated code changes.",
  },
];

export default function JulesGo() {
  const [isDark, setIsDark] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // null = no selection
  const [showTextOverlay, setShowTextOverlay] = useState(false);

  // Trigger text overlay animation when activeIndex changes (only on mobile)
  useEffect(() => {
    if (activeIndex !== null) {
      setShowTextOverlay(true);
      const timer = setTimeout(() => {
        setShowTextOverlay(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "Jules GO",
      icon: "/assets/images/julesgo-icon.svg",
    },
    socials: true,
  };

  return (
    <Page footerConfig={footerConfig}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <a
              href="https://jules.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8 hover:bg-blue-100 transition-colors"
            >
              <FaWandMagicSparkles className="w-4 h-4 mr-2" />
              Powered by Google Jules
            </a>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Code Smarter,
              <span className="block text-gradient-tri mt-2">Anywhere.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Your AI pair programmer on the go. Seamlessly integrate planning,
              reasoning, and execution directly from your mobile device.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* iOS Store Button (Green -> Red) */}
              <button className="relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-rgb-green to-rgb-red text-white cursor-not-allowed opacity-90 shadow-lg shadow-green-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40"></div>
                <FaApple className="w-8 h-8 relative z-10" />
                <div className="text-left relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    Coming Soon
                  </div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>

              {/* Android Store Button (Red -> Blue) */}
              <button className="relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-rgb-red to-rgb-blue text-white cursor-not-allowed opacity-90 shadow-lg shadow-red-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40"></div>
                <FaGooglePlay className="w-7 h-7 relative z-10 ml-0.5" />
                <div className="text-left relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    Coming Soon
                  </div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Power Section (Moved to Second Position) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 mb-8 backdrop-blur-md border border-white/10 shadow-xl">
              <FaBrain className="w-10 h-10 text-purple-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Built on Google Jules API
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Experience the power of Google's advanced AI model designed
              specifically for coding. Jules GO brings this capability to your
              fingertips.
            </p>

            <a
              href="https://developers.google.com/jules/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
            >
              <FaCode className="w-5 h-5 mr-2" />
              View Jules API Docs
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600">
              A complete development environment in your pocket.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Context Aware */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <FaNetworkWired className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Context Aware
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Deep understanding of your entire repository structure and
                logic. Jules knows your code better than you do.
              </p>
            </motion.div>

            {/* Smart Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <FaMessage className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Smart Chat
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Ask anything about your code. Get instant, accurate answers and
                suggestions based on your codebase.
              </p>
            </motion.div>

            {/* Secure & Private */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <FaShieldHalved className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Your code stays safe with local storage and secure API
                transmission. We prioritize your privacy at every step.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Experience Section */}
      <section className="py-12 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-center mb-8 lg:mb-12">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
                Experience
              </h2>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <FaMoon className="w-5 h-5" />
                ) : (
                  <FaSun className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile: Horizontal Scrollable Tabs Above Phone */}
          <div className="lg:hidden w-full mb-8">
            <div className="flex gap-3 overflow-x-auto py-3 px-2 justify-center scrollbar-hide">
              {FEATURES.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-gradient-tri text-white shadow-lg shadow-blue-500/20 scale-110"
                      : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                  }`}
                  title={feature.label}
                >
                  <feature.icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          {/* Desktop & Mobile Content Container */}
          <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-8 lg:gap-0">
            {/* Desktop: Vertical Tabs on Right */}
            <div className="hidden lg:flex flex-1 z-10 justify-start lg:pl-12">
              <div className="flex flex-col gap-3 w-full max-w-md">
                {FEATURES.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveIndex(index)}
                    className={`group flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 border ${
                      index === activeIndex
                        ? "bg-white border-blue-200 shadow-lg shadow-blue-500/10 scale-105"
                        : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50"
                    }`}
                    title={feature.label}
                  >
                    <div
                      className={`p-3 rounded-xl transition-colors duration-300 shrink-0 ${
                        index === activeIndex
                          ? "bg-gradient-tri text-white"
                          : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                      }`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>

                    <div className="w-64">
                      <div
                        className={`font-bold text-lg transition-colors duration-300 ${
                          index === activeIndex
                            ? "text-slate-900"
                            : "text-slate-500"
                        }`}
                      >
                        {feature.label}
                      </div>
                      <div
                        className={`text-sm text-slate-500 mt-1 transition-all duration-300 overflow-hidden ${
                          index === activeIndex
                            ? "max-h-20 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {feature.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Frame - Centered */}
            <div className="w-full lg:flex-1 flex justify-center lg:justify-end relative px-4 lg:pr-12">
              {/* Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[500px] h-[400px] lg:h-[500px] bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-[60px] lg:blur-[80px] -z-10"></div>

              <motion.div
                className="relative h-[80vh] min-h-[500px] w-auto max-w-[420px] lg:max-w-[350px] aspect-[430/932]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Phone Frame */}
                <div
                  className={`absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[8px] shadow-2xl overflow-hidden z-20 transition-colors duration-500 ${
                    isDark
                      ? "border-slate-900 bg-slate-950"
                      : "border-white bg-slate-50 ring-1 ring-slate-200"
                  }`}
                >
                  {/* Safe Area Container */}
                  <div className="absolute inset-0 pt-12 pb-8 px-1 flex flex-col">
                    <div
                      className={`relative flex-1 w-full h-full rounded-2xl overflow-hidden transition-colors duration-300 ${
                        activeIndex === null
                          ? isDark
                            ? "bg-black"
                            : "bg-white"
                          : "bg-transparent"
                      }`}
                    >
                      {/* Dynamic Screen Content - Only show when activeIndex is not null */}
                      {activeIndex !== null && (
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={`${FEATURES[activeIndex].screen}-${isDark}`}
                            src={`/assets/images/jules-${
                              FEATURES[activeIndex].screen
                            }-${isDark ? "dark" : "light"}.svg`}
                            alt={FEATURES[activeIndex].label}
                            className="w-full h-full object-contain"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </AnimatePresence>
                      )}

                      {/* Text Overlay - Shows on tab click on MOBILE ONLY, then fades out */}
                      {activeIndex !== null && (
                        <AnimatePresence>
                          {showTextOverlay && (
                            <motion.div
                              className={`lg:hidden absolute top-12 left-3 right-3 p-4 rounded-2xl shadow-xl backdrop-blur-md z-40 border ${
                                isDark
                                  ? "bg-slate-900/95 border-slate-800"
                                  : "bg-white/95 border-slate-200"
                              }`}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div>
                                <h3
                                  className={`text-left text-sm font-bold mb-0.5 ${
                                    isDark ? "text-white" : "text-slate-900"
                                  }`}
                                >
                                  {FEATURES[activeIndex].label}
                                </h3>
                                <p
                                  className={`text-left text-xs leading-relaxed line-clamp-2 ${
                                    isDark ? "text-slate-300" : "text-slate-600"
                                  }`}
                                >
                                  {FEATURES[activeIndex].description}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>

                  {/* Status Bar Overlay (Mock) */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-10 md:h-12 z-30 flex justify-between px-6 items-center ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <span className="text-[10px] md:text-xs font-medium">
                      9:41
                    </span>
                    <div className="flex gap-1">
                      <div className="w-3 md:w-4 h-2 md:h-2.5 rounded-[1px] border border-current opacity-80"></div>
                      <div className="w-0.5 h-2 md:h-2.5 bg-current opacity-80"></div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-slate-500/50 rounded-full z-30"></div>
                </div>

                {/* Reflection/Glare */}
                <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] ring-1 ring-white/20 z-40 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </Page>
  );
}
