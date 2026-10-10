import { ReactNode } from "react";

export default function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-900/20 ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
        <span className="w-3 h-3 rounded-full bg-rgb-red" />
        <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
        <span className="w-3 h-3 rounded-full bg-rgb-green" />
        {title && (
          <span className="ml-2 font-mono text-xs text-slate-400 truncate">
            {title}
          </span>
        )}
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed text-slate-300 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
