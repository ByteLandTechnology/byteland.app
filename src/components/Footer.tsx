import BrandLogo from "./BrandLogo";
import Link from "next/link";
import { FOOTER_SECTIONS } from "../config/footer";

const isExternal = (href: string) =>
  href.startsWith("http") || href.startsWith("mailto:");

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
      style={{ viewTransitionName: "site-footer" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <BrandLogo />
              <span className="text-lg font-extrabold font-brand text-gradient-tri">
                ByteLand
              </span>
            </Link>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {isExternal(item.href) ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between text-xs text-slate-500">
          <p>&copy; {year} ByteLand Technology Limited. All rights reserved.</p>
          <a
            href="https://github.com/ByteLandTechnology/byteland.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            source: ByteLandTechnology/byteland.app
          </a>
        </div>
      </div>
    </footer>
  );
}
