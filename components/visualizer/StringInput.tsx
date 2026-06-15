"use client";

import { useState } from "react";

interface StringInputProps {
  initialValue: string;
  label?: string;
  /** Optional second text field (e.g. the string `t` to compare against). */
  param?: { label: string; value: string };
  /** Trim surrounding whitespace before applying (default true). Set false when
   *  spaces are significant, e.g. atoi's leading-space handling. */
  trim?: boolean;
  maxLen?: number;
  onApply: (value: string, param?: string) => void;
}

/** Editable, validated text input for string-based visualizers. Mirrors
 *  ArrayInput's look so the two input editors feel identical. */
export function StringInput({ initialValue, label = "Input", param, trim = true, maxLen = 24, onApply }: StringInputProps) {
  const [text, setText] = useState(initialValue);
  const [paramText, setParamText] = useState(param?.value ?? "");
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const value = trim ? text.trim() : text;
    if (value.length === 0) return setError("Enter at least one character.");
    if (value.length > maxLen) return setError(`Keep it to ${maxLen} characters or fewer for a clear view.`);

    let paramValue: string | undefined;
    if (param) {
      paramValue = paramText.trim();
      if (paramValue.length === 0) return setError(`${param.label} can't be empty.`);
      if (paramValue.length > maxLen) return setError(`Keep ${param.label} to ${maxLen} characters or fewer.`);
    }
    setError(null);
    onApply(value, paramValue);
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
        {param && (
          <label className="flex-1 text-xs text-slate-400">
            {param.label}
            <input
              value={paramText}
              onChange={(e) => setParamText(e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
            />
          </label>
        )}
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
