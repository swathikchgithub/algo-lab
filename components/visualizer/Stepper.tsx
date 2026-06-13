"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Frame } from "@/lib/types";
import { CodePanel } from "./CodePanel";
import { StateReadout } from "./StateReadout";
import { Controls } from "./Controls";

interface StepperProps {
  /** Pre-computed animation frames from a pure generator in lib/algorithms. */
  frames: Frame[];
  /** Source lines for the synced code panel (1-indexed by Frame.highlightLine). */
  codeLines: string[];
  /**
   * Draws the visual substrate for a frame (array row, grid, tree, chart…).
   * This is the only algorithm-specific piece; the Stepper owns everything else.
   */
  renderStage: (frame: Frame, index: number) => ReactNode;
  /** ELI5 mode swaps captions to plain language. */
  eli5: boolean;
}

/**
 * Generic frame player. Owns play/pause, step, reset, speed, and keyboard
 * controls (←/→ step, space play/pause). Every visualizer reuses this — no
 * algorithm-specific animation logic lives here; the visual is injected via
 * `renderStage`.
 */
export function Stepper({ frames, codeLines, renderStage, eli5 }: StepperProps) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // steps per second
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const lastIndex = Math.max(0, frames.length - 1);

  // Reset to the first frame whenever the frame set changes (e.g. new input).
  useEffect(() => {
    setIdx(0);
    setPlaying(false);
  }, [frames]);

  const stepForward = useCallback(() => {
    setIdx((i) => Math.min(i + 1, lastIndex));
  }, [lastIndex]);

  const stepBack = useCallback(() => {
    setPlaying(false);
    setIdx((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIdx(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (idx >= lastIndex) setIdx(0); // replay from the start if at the end
    setPlaying((p) => !p);
  }, [idx, lastIndex]);

  // Playback loop.
  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIdx((i) => {
        if (i >= lastIndex) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1000 / speed);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, lastIndex]);

  // Keyboard controls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPlaying(false);
        stepForward();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepForward, stepBack, togglePlay]);

  if (frames.length === 0) {
    return <p className="text-slate-400">No frames to display.</p>;
  }

  const frame = frames[Math.min(idx, lastIndex)];

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg border border-navy-600 bg-navy-800/50 p-4">
        {renderStage(frame, Math.min(idx, lastIndex))}
      </div>

      <Controls
        playing={playing}
        atStart={idx === 0}
        atEnd={idx >= lastIndex}
        progress={lastIndex === 0 ? 1 : idx / lastIndex}
        speed={speed}
        onPlayPause={togglePlay}
        onStepBack={stepBack}
        onStepForward={() => {
          setPlaying(false);
          stepForward();
        }}
        onReset={reset}
        onSpeedChange={setSpeed}
      />

      <StateReadout frame={frame} eli5={eli5} />

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
          <span>
            Step {idx + 1} / {frames.length}
          </span>
        </div>
        <CodePanel lines={codeLines} highlightLine={frame.highlightLine} />
      </div>
    </div>
  );
}
