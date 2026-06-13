"use client";

import { useState } from "react";

interface ArrayInputProps {
  initialArray: number[];
  /** Optional second scalar input (e.g. target, k). */
  param?: { label: string; value: number };
  /** Sort the array ascending before applying (binary search / two pointers). */
  sort?: boolean;
  maxLen?: number;
  onApply: (arr: number[], param?: number) => void;
}

/** Editable, validated array (+ optional scalar) input shared by visualizers. */
export function ArrayInput({ initialArray, param, sort, maxLen = 24, onApply }: ArrayInputProps) {
  const [arrText, setArrText] = useState(initialArray.join(", "));
  const [paramText, setParamText] = useState(param ? String(param.value) : "");
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const parts = arrText.split(",").map((s) => s.trim()).filter(Boolean);
    const nums = parts.map(Number);
    if (nums.length === 0) return setError("Enter at least one number.");
    if (nums.some((n) => !Number.isFinite(n))) return setError("Array must be comma-separated numbers.");
    if (nums.length > maxLen) return setError(`Keep it to ${maxLen} numbers or fewer for a clear view.`);

    let paramValue: number | undefined;
    if (param) {
      paramValue = Number(paramText.trim());
      if (!Number.isFinite(paramValue)) return setError(`${param.label} must be a number.`);
    }

    const finalArr = sort ? [...nums].sort((a, b) => a - b) : nums;
    if (sort) setArrText(finalArr.join(", "));
    setError(null);
    onApply(finalArr, paramValue);
  };

  return (
    <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs text-slate-400">
          Array{sort ? " (auto-sorted ascending)" : ""}
          <input
            value={arrText}
            onChange={(e) => setArrText(e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
          />
        </label>
        {param && (
          <label className="text-xs text-slate-400 sm:w-28">
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
