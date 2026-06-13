interface Eli5ToggleProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

/** Toggle that swaps captions to plain-language ELI5 mode. */
export function Eli5Toggle({ on, onChange }: Eli5ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
        on
          ? "border-cell-current bg-cell-current/15 text-amber-200"
          : "border-navy-600 bg-navy-700 text-slate-300 hover:bg-navy-600"
      }`}
    >
      <span aria-hidden>{on ? "🧸" : "🎓"}</span>
      ELI5 {on ? "on" : "off"}
    </button>
  );
}
