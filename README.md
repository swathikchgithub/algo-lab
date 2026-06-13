# AlgoLab

A DSA interview-prep web app: **question bank + practice tracker + study planner + interactive, frame-based algorithm visualizers** with "explain like I'm 5" (ELI5) explanations.

Built with **Next.js 14 (App Router) · TypeScript (strict) · Tailwind · Framer Motion**. User progress is persisted to `localStorage` behind a swappable storage interface (`lib/storage.ts`), so a database/auth layer can drop in later without touching components. Deployed on **Vercel**.

## Features

- **Question bank** — 110 curated LeetCode-style questions across 10 sections (Arrays → … → Backtracking), organized by pattern. Each has a description, examples, constraints, an ELI5 analogy, 3 progressive hints, a plain-English approach, **Python + Java** reference solutions, complexity, company tags, and a LeetCode link. Filter by section / pattern / difficulty / status / company, plus search.
- **Practice tracker** — per-question status (Not started / Attempted / Solved / Needs review), bookmarks, reveal-on-demand hints/approach/solution, and self-grading (Got it / Struggled / Failed).
- **Coding pad** — a line-numbered editor with **Python/Java** tabs and autosaved per-language drafts, plus a **Run** button that actually executes your code (via a keyless execution API) and shows stdout/stderr.
- **Study planner** — a wizard builds a week-by-week plan in section-dependency order; a daily "Today's questions" list surfaces **spaced-repetition** reviews (struggled/failed questions resurface after 2, 5, then 10 days); "Rebalance" regenerates remaining weeks from your progress.
- **10 algorithm visualizers** — frame-by-frame, interactive: binary search, two pointers, sliding window, monotonic stack, Kadane's, DFS, BFS, heap, hash table, and a Big-O explainer. Each has editable input, Play/Pause/Step/Reset + speed + keyboard controls, a synced **Python** code panel with the executing line highlighted, a live ✓/✗ state readout, and an **ELI5** toggle.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build — must pass with zero errors before a commit is done |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (must be clean) |
| `npm run test` | Vitest unit tests (frame generators + planner/spaced-repetition + dashboard) |
| `npm run test:watch` | Vitest in watch mode |

91 unit tests cover every frame generator and the planner logic; `npm run build` and `npm run lint` are clean.

## Architecture

Dependencies flow **inward** toward `lib/` abstractions. UI never touches `localStorage` directly — only through the storage interface.

```
data/         Typed content — questions (by section) + pattern metadata/ELI5/templates
              (each question ships Python + Java reference solutions)
lib/          Pure logic, no React:
  types.ts      Domain types (Question, Frame, StudyPlan, QuestionProgress, …)
  storage.ts    StorageAdapter interface + SSR-safe LocalStorageAdapter
  algorithms/   One pure frame-generator per visualizer → Frame[] (+ registry, view types)
  planner/      Study-plan generation + spaced-repetition (pure functions)
  execution/    Code-execution adapter (Wandbox) behind a small interface
  dashboard.ts  Streak + difficulty-breakdown helpers (pure)
components/
  visualizer/   Generic <Stepper> engine + array/grid/tree/bucket/chart stages
  questions/    Question detail + the coding pad
  ui/           Shared layout/nav
app/          Routes: / · /questions · /questions/[id] · /visualize · /visualize/[slug]
              · /plan · /patterns/[slug] · /api/run
```

### Visualizer convention (core)

Every visualizer is **frame-based**. A pure function in `lib/algorithms/` turns input into an array of frames:

```ts
interface Frame {
  highlightLine: number;                       // 1-based line in the code panel
  variables: Record<string, string | number>; // live state readout
  caption: string;                             // condition under test, with ✓/✗
  eli5Caption: string;                         // plain-language version
  pointers?: Record<string, number>;           // array substrate (L/M/R …)
  cellStates?: CellState[];                     // array substrate
  view?: Record<string, unknown>;               // grid/tree/bucket/chart payloads
}
```

The generic `<Stepper>` plays frames — it owns play/pause/step/reset, the speed slider, and keyboard controls (←/→ step, space play/pause), and reads only the common fields. The **visual substrate is injected via a `renderStage(frame)` prop**, so the same engine drives array, grid, tree, bucket, and chart visualizers. **Adding a visualizer = a pure frame generator + a thin config in `VisualizerSwitch.tsx` (+ a stage renderer for new substrates).** Never build a one-off animation loop inside a component.

## Coding pad & code execution

Each question page has a coding pad (Python/Java tabs, line numbers, autosaved drafts, **Run**). Execution is proxied through a small server route (`app/api/run`) to the **Wandbox** public API — keyless, so there's no secret to configure — isolated behind `lib/execution/` so swapping in a self-hosted runner is a one-file change.

- The `/api/run` route validates the language against an allowlist and caps source/stdin size before calling out. It needs outbound network access at runtime (available on Vercel serverless functions).
- Java: Wandbox compiles the file as `prog.java`, so a top-level `public class Main` is auto-rewritten to `class Main`; either form works.

### Rate limiting (`/api/run`)

The run endpoint is a public, unauthenticated code-runner, so it is rate-limited **per IP** (10 runs/min, sliding window) via [Upstash Redis](https://upstash.com) — shared state that works across Vercel's stateless serverless instances. It **fails open**: with no Upstash env vars set (local dev, or before you provision it) limiting is disabled and requests pass through; it activates automatically once the vars exist.

To enable it:
1. Create a free Upstash Redis database (Upstash console, or Vercel → **Storage → Marketplace → Upstash**, which auto-injects the vars).
2. Set these environment variables (Vercel → **Settings → Environment Variables**, or `.env.local` for local testing):
   ```
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```
3. Redeploy. Exceeding the limit returns `429` with a `Retry-After` header; the coding pad surfaces the message. Tune the window in `lib/execution/rateLimit.ts`.

## Deploy (Vercel)

```bash
npm i -g vercel
vercel          # first run links/creates the project
vercel --prod
```

No environment variables are required for v1 (content is static; progress lives in the browser).

## Documentation

| Doc | What's in it |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Product requirements — goals, personas, user stories, requirements, system-design + user-flow diagrams |
| [docs/TDD.md](docs/TDD.md) | Technical design — architecture, data model, the visualizer engine & execution subsystem (with sequence diagrams), planner complexity, trade-offs |
| [docs/CODE_WALKTHROUGH.md](docs/CODE_WALKTHROUGH.md) | Guided tour of the codebase, including an end-to-end trace of a visualizer and "how to add one" |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | A timed presenter's script for demoing the app and the code |

## License

[MIT](LICENSE) © 2026 Swathi Chadalavada
