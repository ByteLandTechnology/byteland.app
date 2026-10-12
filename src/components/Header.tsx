import BrandLogo from "./BrandLogo";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";
import { FaGithub, FaBars, FaXmark } from "react-icons/fa6";
import { NAV_LINKS } from "../config/footer";
import { useMotionPolicy } from "../hooks/useMotionPolicy";
import { MOTION } from "../lib/motion";

function MobileNavigation({
  isActive,
  reducedMotion,
  onNavigate,
}: {
  isActive: (href: string) => boolean;
  reducedMotion: boolean;
  onNavigate: () => void;
}) {
  const isPresent = useIsPresent();

  return (
    <motion.nav
      id="mobile-site-navigation"
      aria-hidden={!isPresent}
      inert={!isPresent}
      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={
        reducedMotion
          ? { height: "auto", opacity: 1 }
          : { height: 0, opacity: 0 }
      }
      transition={{
        duration: reducedMotion ? 0 : MOTION.menu,
        ease: MOTION.ease,
      }}
      className="md:hidden overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="px-4 py-3 space-y-1">
        {NAV_LINKS.map((link, index) => (
          <motion.div
            key={link.href}
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : MOTION.feedback,
              delay: reducedMotion ? 0 : index * 0.04,
              ease: MOTION.ease,
            }}
          >
            <Link
              href={link.href}
              scroll={false}
              onClick={onNavigate}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`block px-3 py-2.5 rounded-lg font-medium ${
                isActive(link.href)
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
        <a
          href="https://github.com/ByteLandTechnology"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-300"
        >
          <FaGithub className="w-4 h-4" />
          GitHub
        </a>
      </div>
    </motion.nav>
  );
}

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { reducedMotion } = useMotionPolicy();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  // Project pages belong to Home, where the project list lives.
  const isActive = (href: string) =>
    href === "/"
      ? router.pathname === "/" || router.pathname.startsWith("/opensource")
      : router.pathname.startsWith(href);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          scroll={false}
          className="flex items-center gap-2.5 group"
        >
          <BrandLogo />
          <span className="text-xl font-extrabold tracking-tight font-brand text-gradient-tri">
            ByteLand
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative px-3 py-2 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {/* Every page renders its own header, so the highlight slides
                  between tabs through the page's view transition. */}
              {isActive(link.href) && (
                <span
                  className="absolute inset-0 rounded-lg bg-slate-100 dark:bg-slate-800"
                  style={{ viewTransitionName: "nav-pill" }}
                />
              )}
              <span
                className="relative"
                // Its own layer, so the sliding highlight never covers it.
                style={{
                  viewTransitionName: `nav-${link.label.toLowerCase()}`,
                }}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <a
            href="https://github.com/ByteLandTechnology"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <FaGithub className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          ref={menuButtonRef}
          className="md:hidden p-2 -mr-2 text-slate-600 dark:text-slate-300"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-site-navigation"
        >
          {mobileMenuOpen ? (
            <FaXmark className="w-6 h-6" />
          ) : (
            <FaBars className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNavigation
            key="mobile-navigation"
            isActive={isActive}
            reducedMotion={reducedMotion}
            onNavigate={() => {
              setMobileMenuOpen(false);
              menuButtonRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
