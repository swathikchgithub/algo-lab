"use client";

import { useState } from "react";

interface InputEditorProps {
  initialArray: number[];
  initialTarget: number;
  /** Called with a validated, sorted array + target when the user applies input. */
  onApply: (arr: number[], target: number) => void;
}

/** Editable, validated array + target input for the binary-search visualizer. */
export function InputEditor({ initialArray, initialTarget, onApply }: InputEditorProps) {
  const [arrText, setArrText] = useState(initialArray.join(", "));
  const [targetText, setTargetText] = useState(String(initialTarget));
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const parts = arrText.split(",").map((s) => s.trim()).filter(Boolean);
    const nums = parts.map(Number);
    if (nums.length === 0) return setError("Enter at least one number.");
    if (nums.some((n) => !Number.isFinite(n))) return setError("Array must be numbers separated by commas.");
    if (nums.length > 24) return setError("Keep it to 24 numbers or fewer for a clear view.");
    const target = Number(targetText.trim());
    if (!Number.isFinite(target)) return setError("Target must be a number.");

    // Binary search requires sorted input — sort for the user and inform them.
    const sorted = [...nums].sort((a, b) => a - b);
    setArrText(sorted.join(", "));
    setError(null);
    onApply(sorted, target);
  };

  return (
    <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs text-slate-400">
          Array (sorted ascending)
          <input
            value={arrText}
            onChange={(e) => setArrText(e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
            placeholder="1, 3, 5, 7, 9"
          />
        </label>
        <label className="text-xs text-slate-400 sm:w-28">
          Target
          <input
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
            placeholder="9"
          />
        </label>
        <button
          onClick={apply}
          className="rounded-md bg-cell-current px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-amber-400"
        >
          Run
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      <p className="mt-2 text-xs text-slate-500">
        Input is auto-sorted ascending — binary search requires a sorted array.
      </p>
    </div>
  );
}
