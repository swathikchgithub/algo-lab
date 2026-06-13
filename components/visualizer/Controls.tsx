interface ControlsProps {
  playing: boolean;
  atStart: boolean;
  atEnd: boolean;
  /** 0..1 progress through the frames. */
  progress: number;
  /** Steps per second. */
  speed: number;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const btn =
  "flex h-10 min-w-10 items-center justify-center rounded-md border border-navy-600 bg-navy-700 px-3 text-slate-200 transition hover:bg-navy-600 disabled:opacity-30";

export function Controls({
  playing,
  atStart,
  atEnd,
  progress,
  speed,
  onPlayPause,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-700">
        <div
          className="h-full bg-cell-current transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className={btn} onClick={onStepBack} disabled={atStart} aria-label="Step back">
          ⏮
        </button>
        <button className={btn} onClick={onPlayPause} aria-label={playing ? "Pause" : "Play"}>
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button className={btn} onClick={onStepForward} disabled={atEnd} aria-label="Step forward">
          ⏭
        </button>
        <button className={btn} onClick={onReset} aria-label="Reset">
          🔄 Reset
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          Speed
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.5}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-28"
          />
          <span className="w-8 font-mono text-slate-300">{speed}x</span>
        </label>
      </div>
    </div>
  );
}
