import type { Difficulty } from "@/lib/types";

const STYLES: Record<Difficulty, string> = {
  Easy: "bg-diff-easy/15 text-diff-easy border-diff-easy/30",
  Medium: "bg-diff-medium/15 text-diff-medium border-diff-medium/30",
  Hard: "bg-diff-hard/15 text-diff-hard border-diff-hard/30",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${STYLES[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
