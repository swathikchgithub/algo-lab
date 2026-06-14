"use client";

import { useState } from "react";

interface StringInputProps {
  initialValue: string;
  label?: string;
  maxLen?: number;
  onApply: (value: string) => void;
}

/** Editable, validated text input for string-based visualizers. Mirrors
 *  ArrayInput's look so the two input editors feel identical. */
export function StringInput({ initialValue, label = "Input", maxLen = 24, onApply }: StringInputProps) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const value = text.trim();
    if (value.length === 0) return setError("Enter at least one character.");
    if (value.length > maxLen) return setError(`Keep it to ${maxLen} characters or fewer for a clear view.`);
    setError(null);
    onApply(value);
  };

  return (
    <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs text-slate-400">
          {label}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
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
    </div>
  );
}
