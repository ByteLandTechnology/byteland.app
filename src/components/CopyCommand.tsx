import { useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa6";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (insecure context); ignore.
    }
  };

  return (
    <div className="flex items-start gap-2 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs px-3 py-2.5 border border-slate-800">
      <span className="text-rgb-green select-none">$</span>
      <code className="flex-1 break-all">{command}</code>
      <button
        onClick={copy}
        className="shrink-0 text-slate-400 hover:text-white transition-colors"
        aria-label="Copy command"
      >
        {copied ? (
          <FaCheck className="w-3.5 h-3.5 text-rgb-green" />
        ) : (
          <FaRegCopy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
