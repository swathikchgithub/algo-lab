"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LANGUAGES, type Language } from "@/lib/types";
import { storage } from "@/lib/storage";
import { runCode } from "@/lib/execution/client";
import type { RunResult } from "@/lib/execution/types";

// Starter stubs so a fresh pad is immediately runnable (Java needs `class Main`).
const STARTERS: Record<Language, string> = {
  python: `# Write and run your solution here.\nprint("Hello from Python")\n`,
  java: `class Main {\n    public static void main(String[] args) {\n        // Write and run your solution here.\n        System.out.println("Hello from Java");\n    }\n}\n`,
};

const LABELS: Record<Language, string> = { python: "Python", java: "Java" };

/**
 * Line-numbered coding pad with per-language drafts (autosaved), tab-to-indent,
 * and a Run button that executes via the backend. One pad per question.
 */
export function CodePad({ questionId }: { questionId: string }) {
  const [lang, setLang] = useState<Language>("python");
  const [drafts, setDrafts] = useState<Record<Language, string>>({ python: "", java: "" });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Hydrate drafts from storage on the client; fall back to starter stubs.
  useEffect(() => {
    const next = {} as Record<Language, string>;
    for (const l of LANGUAGES) {
      const saved = storage.getScratchpad(questionId, l);
      next[l] = saved || STARTERS[l];
    }
    setDrafts(next);
  }, [questionId]);

  const code = drafts[lang];
  const lineCount = useMemo(() => Math.max(1, code.split("\n").length), [code]);

  const update = (value: string) => {
    setDrafts((d) => ({ ...d, [lang]: value }));
    storage.setScratchpad(questionId, lang, value);
    setResult(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = el;
    const next = code.slice(0, s) + "    " + code.slice(end);
    update(next);
    // Restore caret after the inserted spaces on the next tick.
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = s + 4;
    });
  };

  const run = async () => {
    setRunning(true);
    setResult(null);
    const r = await runCode({ language: lang, source: code });
    setResult(r);
    setRunning(false);
  };

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                lang === l ? "bg-cell-active text-white" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
              }`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
        <button
          onClick={run}
          disabled={running}
          className="ml-auto rounded-md bg-cell-current px-4 py-1.5 text-sm font-semibold text-navy-900 hover:bg-amber-400 disabled:opacity-50"
        >
          {running ? "Running…" : "▶ Run"}
        </button>
        <button
          onClick={() => update(STARTERS[lang])}
          className="rounded-md border border-navy-600 bg-navy-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-navy-600"
        >
          Reset
        </button>
      </div>

      {/* Editor: line-number gutter + textarea, scroll-synced. */}
      <div className="flex overflow-hidden rounded-md border border-navy-600 bg-navy-900">
        <div
          ref={gutterRef}
          aria-hidden
          className="thin-scroll max-h-80 select-none overflow-hidden bg-navy-800 py-3 text-right font-mono text-sm leading-6 text-slate-600"
          style={{ minWidth: "3rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="px-2">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => update(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          rows={12}
          className="thin-scroll max-h-80 flex-1 resize-y bg-navy-900 px-3 py-3 font-mono text-sm leading-6 text-slate-100 focus:outline-none"
        />
      </div>
      <p className="text-xs text-slate-500">
        Drafts autosave per language to this browser. Tab inserts 4 spaces.
      </p>

      {(running || result) && <OutputPanel running={running} result={result} />}
    </div>
  );
}

function OutputPanel({ running, result }: { running: boolean; result: RunResult | null }) {
  return (
    <div className="rounded-md border border-navy-600 bg-navy-900 p-3 font-mono text-sm">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Output</p>
      {running && <p className="text-slate-400">Running your code…</p>}
      {!running && result && (
        <div className="flex flex-col gap-2">
          {result.error && <p className="text-rose-400">⚠ {result.error}</p>}
          {result.stdout && <pre className="thin-scroll overflow-x-auto whitespace-pre-wrap text-slate-100">{result.stdout}</pre>}
          {result.stderr && (
            <pre className="thin-scroll overflow-x-auto whitespace-pre-wrap text-rose-300">{result.stderr}</pre>
          )}
          {!result.error && !result.stdout && !result.stderr && (
            <p className="text-slate-500">(no output)</p>
          )}
          {result.exitCode !== null && (
            <p className={result.ok ? "text-diff-easy" : "text-diff-hard"}>
              Exit code: {result.exitCode}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
