import { LANGUAGE_COLORS } from "../config/projects";

export default function LanguageBadge({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: LANGUAGE_COLORS[language] ?? "#94a3b8" }}
      />
      {language}
    </span>
  );
}
