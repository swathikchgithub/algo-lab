interface CodePanelProps {
  lines: string[];
  /** 1-based line to highlight as currently executing. */
  highlightLine: number;
}

/** Code panel with line numbers; the active line gets an amber left border. */
export function CodePanel({ lines, highlightLine }: CodePanelProps) {
  return (
    <pre className="thin-scroll overflow-x-auto rounded-lg border border-navy-600 bg-navy-800 py-3 font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        const lineNo = i + 1;
        const active = lineNo === highlightLine;
        return (
          <div
            key={lineNo}
            className={`flex pl-0 pr-4 ${
              active
                ? "border-l-2 border-cell-current bg-cell-current/10"
                : "border-l-2 border-transparent"
            }`}
          >
            <span className="w-10 select-none px-2 text-right text-slate-600">
              {lineNo}
            </span>
            <code className={active ? "text-amber-100" : "text-slate-300"}>
              {line || " "}
            </code>
          </div>
        );
      })}
    </pre>
  );
}
