import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { nanoid } from "nanoid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "inherit",
});

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const id = useRef(`mermaid-${nanoid()}`);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const { svg } = await mermaid.render(id.current, chart);
        setSvg(svg);
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
        // Keep the raw chart as fallback or show error
        setSvg(
          `<pre class="text-red-500 bg-red-50 p-4 rounded">${error instanceof Error ? error.message : "Syntax error in graph"}</pre>`,
        );
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="mermaid-chart flex justify-center my-8 bg-slate-50 p-4 rounded-xl overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
