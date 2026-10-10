import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import TerminalWindow from "./TerminalWindow";

/** A code sample in a terminal-style window. */
export default function CodeBlock({
  code,
  lang,
  title,
}: {
  code: string;
  lang: string;
  title: string;
}) {
  return (
    <TerminalWindow title={title} className="text-left">
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={lang}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: 0,
          background: "transparent",
          fontSize: "0.85rem",
          lineHeight: 1.6,
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </TerminalWindow>
  );
}
