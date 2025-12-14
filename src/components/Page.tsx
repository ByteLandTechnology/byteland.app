import { ReactNode } from "react";
import Header from "./Header";
import Footer, { FooterConfig } from "./Footer";

interface PageProps {
  children: ReactNode;
  footerConfig?: FooterConfig;
  className?: string;
}

export default function Page({
  children,
  footerConfig,
  className = "bg-slate-50",
}: PageProps) {
  return (
    <div className={`min-h-screen font-sans ${className}`}>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer config={footerConfig} />
    </div>
  );
}
