import { useEffect, useRef, useState, useId } from "react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const reactId = useId().replace(/:/g, "-");

  useEffect(() => {
    let cancelled = false;
    setSvg("");
    setError(null);

    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const mermaid = (await import("mermaid")).default;
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "strict",
          fontFamily: "inherit",
        });
        const { svg } = await mermaid.render(`mermaid-${reactId}`, chart);
        if (!cancelled) setSvg(svg);
      } catch (error) {
        if (!cancelled) {
          console.error("Mermaid rendering failed:", error);
          setError(
            error instanceof Error ? error.message : "Syntax error in graph",
          );
        }
      }
    };

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  return (
    <div
      ref={containerRef}
      className="mermaid-chart flex justify-center my-8 bg-slate-50 dark:bg-white p-4 rounded-xl overflow-x-auto"
    >
      {error ? (
        <pre className="text-red-500 bg-red-50 p-4 rounded">{error}</pre>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
}
