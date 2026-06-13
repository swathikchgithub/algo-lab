# CLAUDE.md — AlgoLab

AlgoLab is a DSA interview-prep web app: question bank + practice tracker + study planner + interactive algorithm visualizers with ELI5 explanations. Deployed on Vercel.

## Tech stack

- Next.js 14+ (App Router) + TypeScript, strict mode
- Tailwind CSS, dark theme by default
- Framer Motion for visualizer animations
- localStorage for user progress in v1 — all persistence goes through `lib/storage.ts` so a database/auth layer can be swapped in later. Never call localStorage directly from components.
- All question/pattern content lives in typed data files under `/data` — no backend in v1.

## Commands

- `npm run dev` — local dev
- `npm run build` — must pass with zero errors before any commit is considered done
- `npm run test` — unit tests (frame generators especially)
- `npm run lint` — must be clean

## Project structure

- `app/` — routes: `/` (dashboard), `/questions`, `/questions/[id]`, `/plan`, `/visualize`, `/visualize/[slug]`, `/patterns/[slug]`
- `components/visualizer/` — Stepper engine + shared visualizer UI (cells, pointer badges, code panel, controls)
- `lib/algorithms/` — pure frame-generator functions, one per algorithm. No React imports here. Fully unit-testable.
- `lib/planner/` — study-plan generation + spaced repetition logic (pure functions)
- `lib/storage.ts` — single persistence interface
- `data/questions/` — question records grouped by section
- `data/patterns.ts` — pattern metadata, ELI5 analogies, template code

## Data model

Question record fields: `id`, `title`, `section`, `pattern`, `difficulty` (Easy | Medium | Hard), `description`, `examples[]` (input/output/explanation), `constraints[]`, `eli5`, `hints[]` (3, progressive), `approach`, `solutions` (python + java, commented), `timeComplexity`, `spaceComplexity`, `companies[]`, `leetcodeSlug`.

Sections in dependency order (the planner relies on this order): Arrays → Strings → Linked Lists → Stacks & Queues → Binary Search → Trees → Heaps & Priority Queues → Graphs → Dynamic Programming → Backtracking. Each section is organized by pattern (e.g., Arrays → Two Pointers; Stacks → Monotonic Stack; Heaps → Top-K, Two-Heap; Graphs → BFS, DFS/Backtracking) with a one-line pattern blurb.

User progress per question: status (Not started | Attempted | Solved | Needs review), self-grade history (Got it | Struggled | Failed), scratchpad draft, bookmark flag, timestamps.

## Visualizer architecture (core convention — do not deviate)

Every visualizer is frame-based:

1. A pure function in `lib/algorithms/` takes input and returns `Frame[]`. A frame's common fields are `{ highlightLine, variables, caption, eli5Caption }`. Array-based visualizers also set `pointers` + `cellStates`; non-array visualizers (grid/tree/bucket/chart) carry substrate data in `view` (a typed payload each module casts).
2. The generic `<Stepper>` component in `components/visualizer/` plays frames. It owns play/pause/step-forward/step-back/reset, speed slider, and keyboard controls (←/→ step, space play/pause), and reads only the common frame fields. The visual substrate is injected via a `renderStage(frame)` prop, so the Stepper never knows about any specific algorithm.
3. New visualizers are added by writing a new frame generator + a thin config (code lines, input editor schema) + a `renderStage` (reuse `CellRow` for array visualizers, or a grid/tree/bucket/chart stage). Never build a one-off animation loop inside a component.

## Visual design rules

- Dark navy background (~#0a0e1a); array cells are 44px rounded squares
- Cell states: active/window = blue; current/mid = amber/gold; visited/discarded = dimmed
- Pointer badges (L, M, R, etc.) render above cells with small arrow markers
- Page header per visualizer: large monospace title, "Complexity: O(...)" pill badge, one-line tagline
- Code panel: line numbers, syntax highlighting, currently-executing line highlighted with an amber left border, synced to the active frame
- State readout shows live variable values and the condition under test with an explicit ✓/✗ (e.g., "9 < 13 ✗ → move left")
- Every visualizer has editable input (user-supplied array/target) with validation
- Mobile-first: touch-friendly controls, no layout shift during animation

## ELI5 mode

A global toggle, available on every pattern page and every visualizer. When on: show the analogy panel before any code, and swap frame captions to `eli5Caption`. Canonical analogies live in `data/patterns.ts` (binary search = 1–100 guessing game halving the options; sliding window = houses passing a train window; two pointers = friends walking toward each other in a hallway; hash table = labeled cubbies; DFS = maze with backtracking; BFS = pond ripples; stack = pancakes; heap = tournament bracket; Kadane's = drop the money bag when it goes negative; Big-O = sorted library kills half the shelves per question). Reuse these — don't invent new analogies for the same pattern.

## Study planner rules

- Wizard inputs: target date or weeks, hours/week, level (Beginner/Intermediate/Advanced), target companies
- Plans allocate questions per week following section dependency order, front-loading Easy
- Spaced repetition: questions graded Struggled/Failed resurface after 2, then 5, then 10 days; reviews appear in the daily "Today's questions" list (3–5 items/day)
- "Rebalance my plan" regenerates remaining weeks from current progress without losing history

## Quality bar

- `next build` clean; deploys with `vercel deploy`
- Lighthouse performance > 90
- Keyboard accessible; responsive down to ~380px width
- Unit tests for every frame generator and the planner/spaced-repetition logic
- Commit incrementally with descriptive messages
