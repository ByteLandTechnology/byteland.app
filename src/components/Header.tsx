import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useFloating, offset, shift, autoUpdate } from "@floating-ui/react";
import { getPageConfig } from "../config/pages";

export default function Header() {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const pageData = getPageConfig(router.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: productsDropdownOpen,
    onOpenChange: setProductsDropdownOpen,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(8), shift({ padding: 16 })],
    whileElementsMounted: autoUpdate,
  });

  const products = [
    {
      name: "Jules GO",
      path: "/jules-go",
      icon: "/assets/images/julesgo-icon.svg",
      description: "AI pair programmer on the go",
      status: "Available",
    },
    {
      name: "Seelist",
      path: "/seelist",
      icon: "/assets/images/seelist-icon.svg",
      description: "Movie & show tracker",
      status: "Coming Soon",
    },
    {
      name: "JoyDex",
      path: "/joydex",
      icon: "/assets/images/joydex-icon.svg",
      description: "Pokémon companion app",
      status: "Coming Soon",
    },
  ];

  const navLinks = [
    { href: "/opensource", label: "Open Source" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 pointer-events-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 min-w-[200px]">
          {isHome && (
            // HOME STATE: ByteLand Logo & Title
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
              key="home-logo"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <motion.div
                layoutId="byteland-group"
                className="flex items-center gap-2"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/assets/images/logo.svg"
                  alt="ByteLand Logo"
                  className="h-8 w-auto"
                />
                <motion.span
                  className="text-2xl font-extrabold tracking-tight font-brand text-gradient-tri whitespace-nowrap overflow-hidden"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  transition={{
                    layout: { type: "spring", bounce: 0.2, duration: 0.6 },
                    width: {
                      delay: 0.5,
                      duration: 0.3,
                      ease: "easeOut",
                    },
                    opacity: { delay: 0.5, duration: 0.3 },
                  }}
                >
                  ByteLand
                </motion.span>
              </motion.div>
            </Link>
          )}

          <AnimatePresence mode="popLayout">
            {!isHome && (
              // OTHER PAGE STATE: Page Icon & Title
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                key={`page-${pageData?.id || "unknown"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                whileHover={{ scale: 1.05 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {pageData && (
                  <>
                    <motion.img
                      layoutId={`icon-${pageData.id}`}
                      src={pageData.icon}
                      alt={`${pageData.title} Icon`}
                      className="h-8 w-auto"
                      initial={{ x: -100, opacity: 0, scale: 0.8 }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          type: "spring",
                          bounce: 0.3,
                          duration: 0.7,
                          delay: 0.1,
                        },
                      }}
                      exit={{
                        x: -100,
                        opacity: 0,
                        scale: 0.8,
                        transition: {
                          duration: 0.3,
                        },
                      }}
                    />
                    <motion.span
                      className={`text-2xl font-extrabold tracking-tight font-brand ${pageData.color} overflow-hidden`}
                      initial={{
                        x: -80,
                        opacity: 0,
                        maxWidth: 0,
                        filter: "blur(8px)",
                      }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        maxWidth: "200px",
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          bounce: 0.3,
                          duration: 0.7,
                          delay: 0.25,
                          maxWidth: {
                            delay: 0.25,
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          },
                          filter: {
                            delay: 0.3,
                            duration: 0.4,
                          },
                        },
                      }}
                      exit={{
                        x: -80,
                        opacity: 0,
                        maxWidth: 0,
                        filter: "blur(8px)",
                        transition: {
                          duration: 0.25,
                          maxWidth: {
                            duration: 0.2,
                          },
                        },
                      }}
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pageData.title}
                    </motion.span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* ByteLand Icon on non-home pages */}
          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-2 group"
              title="Back to ByteLand"
              key="right-logo"
            >
              <motion.div
                layoutId="byteland-group"
                layout="preserve-aspect"
                className="flex items-center gap-2"
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6,
                }}
              >
                <img
                  src="/assets/images/logo.svg"
                  alt="ByteLand Logo"
                  className="h-8 w-auto"
                />
              </motion.div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                ref={refs.setReference}
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className="hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                Products
                <svg
                  className={`w-4 h-4 transition-transform ${
                    productsDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {productsDropdownOpen && (
                  <motion.div
                    ref={refs.setFloating}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    style={floatingStyles}
                  >
                    <div className="p-2">
                      {products.map((product) => (
                        <Link
                          key={product.path}
                          href={product.path}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <img
                            src={product.icon}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 group-hover:text-rgb-blue transition-colors">
                                {product.name}
                              </h3>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  product.status === "Available"
                                    ? "bg-rgb-green/10 text-rgb-green"
                                    : "bg-yellow-500/10 text-yellow-600"
                                }`}
                              >
                                {product.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {product.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-slate-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.line
                stroke="#007AFF"
                initial={{ x1: 3, y1: 6, x2: 21, y2: 6 }}
                animate={
                  mobileMenuOpen
                    ? { x1: 18, y1: 6, x2: 6, y2: 18 }
                    : { x1: 3, y1: 6, x2: 21, y2: 6 }
                }
                transition={{ duration: 0.3 }}
              />
              <motion.line
                stroke="#34C759"
                initial={{ opacity: 1, x1: 3, y1: 12, x2: 21, y2: 12 }}
                animate={
                  mobileMenuOpen
                    ? { opacity: 0, x1: 12, y1: 12, x2: 12, y2: 12 }
                    : { opacity: 1, x1: 3, y1: 12, x2: 21, y2: 12 }
                }
                transition={{ duration: 0.3 }}
              />
              <motion.line
                stroke="#FF3B30"
                initial={{ x1: 3, y1: 18, x2: 21, y2: 18 }}
                animate={
                  mobileMenuOpen
                    ? { x1: 6, y1: 6, x2: 18, y2: 18 }
                    : { x1: 3, y1: 18, x2: 21, y2: 18 }
                }
                transition={{ duration: 0.3 }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 pointer-events-auto overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 space-y-3 text-sm font-medium text-slate-600">
              {/* Products Section in Mobile */}
              <div>
                <button
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className="w-full py-2 px-3 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-between"
                >
                  <span>Products</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      productsDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {productsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {products.map((product) => (
                          <Link
                            key={product.path}
                            href={product.path}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setProductsDropdownOpen(false);
                            }}
                          >
                            <img
                              src={product.icon}
                              alt={product.name}
                              className="w-6 h-6 rounded"
                            />
                            <span>{product.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-2 px-3 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
