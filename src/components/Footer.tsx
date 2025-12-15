import { ReactNode } from "react";
import { FaGithub, FaEnvelope } from "react-icons/fa6";
import Link from "next/link";
import { DEFAULT_FOOTER_LINKS } from "../config/footer";

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterConfig {
  variant?: "grid" | "row" | "centered" | "simple";
  brand?: {
    title: string;
    description?: string;
    icon?: string;
  };
  links?: {
    title?: string;
    items: FooterLink[];
  }[];
  socials?: boolean;
  customContent?: ReactNode;
}

interface FooterProps {
  config?: FooterConfig;
  children?: ReactNode; // Keep children for backward compatibility or custom overrides
}

export default function Footer({ config, children }: FooterProps) {
  const year = new Date().getFullYear();

  // Helper to render links
  const renderLinks = (links: FooterLink[]) => (
    <ul className="space-y-2 text-sm">
      {links.map((link) => (
        <li key={link.label}>
          {link.href && !link.href.startsWith("http") ? (
            <Link
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ) : (
            <a
              href={link.href}
              className="hover:text-white transition-colors"
              target={link.href?.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href?.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  // Helper to render social icons
  const renderSocials = () => (
    <div className="flex gap-4">
      <a
        href="https://github.com/ByteLandTechnology"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors"
      >
        <FaGithub className="w-5 h-5" />
      </a>
      <a
        href="mailto:info@byteland.app"
        className="hover:text-white transition-colors"
      >
        <FaEnvelope className="w-5 h-5" />
      </a>
    </div>
  );

  const renderContent = () => {
    if (children) return children;
    if (!config) return null;

    const { variant = "grid", brand, links, socials, customContent } = config;
    const footerLinks = (links || DEFAULT_FOOTER_LINKS) as {
      title?: string;
      items: FooterLink[];
    }[];

    const renderVariant = () => {
      switch (variant) {
        case "grid":
          return (
            <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
              {brand && (
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 mb-4">
                    {brand.icon && (
                      <img
                        src={brand.icon}
                        alt={`${brand.title} Icon`}
                        className="h-8 w-auto"
                      />
                    )}
                    <h4 className="font-bold text-lg font-brand text-gradient-tri">
                      {brand.title}
                    </h4>
                  </div>
                  {brand.description && (
                    <p className="text-sm max-w-xs">{brand.description}</p>
                  )}
                </div>
              )}
              {footerLinks?.map((section, idx) => (
                <div key={idx}>
                  {section.title && (
                    <h4 className="text-white font-bold text-lg mb-4">
                      {section.title}
                    </h4>
                  )}
                  <div className="flex flex-col items-center md:items-start">
                    {renderLinks(section.items)}
                  </div>
                </div>
              ))}
              {socials && (
                <div className="flex flex-col items-center md:items-start">
                  <h4 className="text-white font-bold text-lg mb-4">Connect</h4>
                  {renderSocials()}
                </div>
              )}
            </div>
          );

        case "row":
          return (
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
              {brand && (
                <div className="flex items-center gap-3">
                  {brand.icon && (
                    <img
                      src={brand.icon}
                      alt={`${brand.title} Icon`}
                      className="h-10 w-auto opacity-80"
                    />
                  )}
                  <span className="text-2xl font-extrabold tracking-tight font-brand text-gradient-tri">
                    {brand.title}
                  </span>
                </div>
              )}
              {footerLinks?.map((section, idx) => (
                <div key={idx} className="flex gap-8 text-sm font-medium">
                  {section.items.map((link) =>
                    link.href && !link.href.startsWith("http") ? (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className="hover:text-white transition-colors"
                        target={
                          link.href?.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href?.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              ))}
              {socials && <div className="flex gap-4">{renderSocials()}</div>}
            </div>
          );

        case "centered":
          return (
            <div className="text-center mb-8">
              {brand && (
                <div className="mb-6">
                  {brand.icon && (
                    <img
                      src={brand.icon}
                      alt={`${brand.title} Icon`}
                      className="h-12 w-auto mx-auto mb-3 opacity-80"
                    />
                  )}
                  <h4 className="text-2xl font-extrabold tracking-tight font-brand text-gradient-tri mb-2">
                    {brand.title}
                  </h4>
                  {brand.description && (
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      {brand.description}
                    </p>
                  )}
                </div>
              )}
              {footerLinks?.map((section, idx) => (
                <div
                  key={idx}
                  className="flex justify-center gap-8 mb-8 text-sm font-medium"
                >
                  {section.items.map((link) =>
                    link.href && !link.href.startsWith("http") ? (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className="hover:text-white transition-colors"
                        target={
                          link.href?.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href?.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              ))}
              {socials && (
                <div className="flex justify-center gap-6">
                  {renderSocials()}
                </div>
              )}
            </div>
          );

        case "simple":
        default:
          return null;
      }
    };

    return (
      <>
        {renderVariant()}
        {customContent}
      </>
    );
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 relative border-t border-slate-800">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-tri"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p className="mb-2">
            &copy; {year} ByteLand Technology Limited. All rights reserved.
          </p>
          <p>
            This website is open source.{" "}
            <a
              href="https://github.com/ByteLandTechnology/byteland.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 underline underline-offset-2 transition-colors"
            >
              View Source Code
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
