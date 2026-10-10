import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageProps {
  children: ReactNode;
  className?: string;
}

export default function Page({ children, className = "" }: PageProps) {
  return (
    <div className={`min-h-screen flex flex-col font-sans ${className}`}>
      <Header />
      <main className="pt-16 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
