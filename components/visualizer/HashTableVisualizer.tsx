"use client";

import { useMemo, useState } from "react";
import type { BucketView } from "@/lib/algorithms/views";
import { hashTableCode, hashTableFrames } from "@/lib/algorithms/hashTable";
import { PATTERNS } from "@/data/patterns";
import { Stepper } from "./Stepper";
import { BucketStage } from "./BucketStage";
import { Eli5Toggle } from "./Eli5Toggle";
import { Eli5Panel } from "./Eli5Panel";

/** Hash-table build visualizer: keys land in buckets via hash % numBuckets. */
export function HashTableVisualizer() {
  const [keys, setKeys] = useState<string[]>(["cat", "dog", "bird", "fish", "owl"]);
  const [buckets, setBuckets] = useState(5);
  const [keyText, setKeyText] = useState("cat, dog, bird, fish, owl");
  const [eli5, setEli5] = useState(false);

  const frames = useMemo(() => hashTableFrames(keys, buckets).frames, [keys, buckets]);
  const pattern = PATTERNS["string-hashing"];

  const apply = () => {
    const parsed = keyText.split(",").map((s) => s.trim()).filter(Boolean);
    if (parsed.length > 0) setKeys(parsed);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm text-slate-400">Interactive demo</h2>
        <Eli5Toggle on={eli5} onChange={setEli5} />
      </div>

      {eli5 && pattern && <Eli5Panel pattern={pattern} />}

      <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-xs text-slate-400">
            Keys (comma-separated)
            <input
              value={keyText}
              onChange={(e) => setKeyText(e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-cell-current focus:outline-none"
            />
          </label>
          <label className="text-xs text-slate-400 sm:w-28">
            Buckets: {buckets}
            <input
              type="range"
              min={2}
              max={10}
              value={buckets}
              onChange={(e) => setBuckets(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <button
            onClick={apply}
            className="rounded-md bg-cell-current px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-amber-400"
          >
            Run
          </button>
        </div>
      </div>

      <Stepper
        frames={frames}
        codeLines={hashTableCode}
        eli5={eli5}
        renderStage={(f) => <BucketStage view={f.view as unknown as BucketView} />}
      />
    </div>
  );
}
