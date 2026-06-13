# AlgoLab — Presenter's Demo Script

A timed, sectioned script for demoing **both the running app and the codebase**. Works for a stakeholder demo, a code review, or a tech talk. Read the talking points (**Say:**) in your own words; follow the actions (**Do:**) exactly.

**What AlgoLab is (one-liner for the open):** A DSA interview-prep web app — question bank + practice tracker + study planner + frame-based algorithm visualizers with ELI5 explanations. Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion; progress in `localStorage` behind a swappable adapter; deployed on Vercel.

---

## Suggested runtime: ~10–12 min

| Part | Section | Time box |
|---|---|---|
| — | Setup / pre-flight (before audience) | — |
| A | 1. Dashboard | 0:45 |
| A | 2. Question bank — filter + search | 1:00 |
| A | 3. Question detail — hints, ELI5, Python/Java | 1:15 |
| A | 4. Coding pad — Run Python, switch to Java, Run | 1:30 |
| A | 5. Visualizer deep-dive — Binary Search | 2:00 |
| A | 6. Non-array visualizer — DFS grid (or Heap) | 1:15 |
| A | 7. Study planner — wizard → weekly/today → Rebalance | 1:30 |
| B | Code tour (technical audience) | 2:30 |
| — | Q&A | buffer |

> If you're short on time, drop Part B or trim section 6. Sections 5 (visualizer) and 4 (Run) are the showpieces — never cut those.

---

## Setup / pre-flight checklist

Run **before** the audience is watching:

```bash
cd /Users/swathi.chadalavada/git/algo-lab
npm install          # first time only
npm run test         # optional confidence check — 91 passing
npm run dev          # serves http://localhost:3000
```

Have open and ready:

- [ ] **Browser** at `http://localhost:3000`, window sized wide enough to show the code panel beside the visualizer.
- [ ] **Editor** (VS Code etc.) open at the repo root for Part B. Pre-open the tour files in tabs so you're not fumbling: `lib/types.ts`, `lib/algorithms/binarySearch.ts`, `components/visualizer/Stepper.tsx`, `lib/algorithms/registry.ts`, `components/visualizer/VisualizerSwitch.tsx`, `lib/storage.ts`, `app/api/run/route.ts`, `lib/execution/wandbox.ts`, `lib/planner/`.
- [ ] **Network** — the coding pad's **Run** calls out to `wandbox.org`. Confirm outbound access on the demo machine/Wi-Fi; have a backup screenshot of a successful Run in case the venue blocks it.
- [ ] **Reset progress for a clean demo:** the dashboard ring, streak, and saved drafts come from `localStorage`. To start fresh, open DevTools → Application → Local Storage → `http://localhost:3000` → **Clear**, then reload. (Or run `localStorage.clear()` in the console.) Conversely, if you want the dashboard to look "lived in," mark a few questions Solved beforehand.

---

# PART A — Product demo (click-through)

### 1. Dashboard — `/` · 0:45

- **Do:** Open `http://localhost:3000`.
- **Say:** "This is the home dashboard. Top-left is a **progress ring** — solved out of 110 questions across 10 sections. There's a **study streak**, **today's plan** queue, and **per-section progress bars** in dependency order: Arrays, Strings, Linked Lists, all the way to Backtracking. Everything you see is computed from local progress, no backend."
- **Do:** Point at one section bar, then click into **Questions** in the nav.

### 2. Question bank — `/questions` · 1:00

- **Do:** On `/questions`, apply a filter — pick **Section: Arrays** and **Difficulty: Easy**. Then type a term in the **search** box (e.g. "two sum").
- **Say:** "The bank has 110 questions. You can filter by **section, pattern, difficulty, status, and target company**, plus free-text search — exactly how someone preps for a specific company or drills one weak pattern."
- **Do:** Click a question (e.g. **Two Sum**) to open its detail page.

### 3. Question detail — `/questions/[id]` · 1:15

- **Do:** Scroll through: description → examples → constraints. Reveal the **progressive hints** one at a time.
- **Say:** "Each question reads top to bottom like a real problem: description, worked examples, constraints. Hints are **progressive** — three of them, revealed one at a time, so you can get nudged without spoiling the answer."
- **Do:** Toggle **ELI5** on; show the plain-language analogy panel. Then scroll to the solution and switch the **Python / Java** tabs.
- **Say:** "**ELI5 mode** swaps in a plain-language analogy — every question and visualizer has it. Below that is the approach and a **reference solution in both Python and Java**, fully commented. Note the **'Visualize this pattern'** link — it jumps to the matching animation, which I'll show in a second."

### 4. Coding pad — Run Python, then Java · 1:30

- **Do:** Scroll to the **coding pad** on the same page. On the **Python** tab, clear it and type a tiny snippet:
  ```python
  print(sum([2, 7, 11, 15]))
  ```
- **Do:** Click **▶ Run**. Wait for the output panel to show **stdout** (`35`) and exit code.
- **Say:** "This is a real coding pad — line-numbered, tab-to-indent, and **drafts autosave per language** to this browser. **Run** actually executes the code and shows stdout, stderr, and exit code."
- **Do:** Switch to the **Java** tab. Note the draft is separate and pre-stubbed with `class Main`. Run the stub (prints `Hello from Java`).
- **Say:** "Same pad, **separate autosaved draft per language**. Execution goes through our own `/api/run` route to the keyless **Wandbox** public API — nothing to configure, no secret. Java is handled too: Wandbox compiles as `prog.java`, so a `public class Main` is auto-rewritten before it runs."

### 5. Visualizer deep-dive — Binary Search · 2:00

> This is the centerpiece. Slow down here.

- **Do:** Go to `/visualize` (the **gallery of 10**), then open **Binary Search** (`/visualize/binary-search`).
- **Say:** "Ten live visualizers. Every one is **frame-based** — I'll show why that matters in the code tour. Let's open Binary Search."
- **Do:** Press **Play**. Let it animate a couple of steps, then **Pause**.
- **Say:** "The array cells animate. **L, M, R pointer badges** sit above the cells; the live window is blue, the midpoint is amber, the discarded half dims out."
- **Do:** Use the **→ / ←** keys (or Step buttons) to move one frame at a time. Point at the **code panel** beside it.
- **Say:** "Step forward and back. The **Python code panel on the right is synced to the current frame** — the currently-executing line gets an amber left border. And the **state readout** shows the live variables and the condition under test with an explicit check or cross — like `9 < 13 ✗ → move left`. You see the exact decision the algorithm makes."
- **Do:** **Edit the input** — change the array and/or target in the input editor and re-run; show validation rejects bad input.
- **Say:** "Input is **editable and validated** — your own array and target, the frames regenerate."
- **Do:** Toggle **ELI5** on.
- **Say:** "And ELI5 swaps the captions to plain language — binary search becomes the 1-to-100 guessing game where each guess halves what's left."

### 6. Non-array visualizer — DFS grid (or Heap) · 1:15

- **Do:** Back to `/visualize`, open **DFS on a Grid** (`/visualize/dfs`).
- **Say:** "The same Stepper engine drives totally different visuals. Here the substrate is a **grid plus a call-stack panel** — you watch DFS dive down one path and backtrack at dead ends, with the recursion stack growing and shrinking. Same Play/Step/keyboard controls, same synced code panel and ELI5."
- **Do:** Play a few frames; point at the call-stack panel growing/shrinking.
- *(Alternative: open **Heap (Top-K)** at `/visualize/heap` to show the SVG heap tree bubbling values into place — pick whichever lands better with the audience.)*

### 7. Study planner — `/plan` · 1:30

- **Do:** Open `/plan`. Walk the **wizard**: target date or weeks, hours/week, level (Beginner/Intermediate/Advanced), target companies. Generate the plan.
- **Say:** "The planner takes a target date or number of weeks, your hours/week, level, and target companies, then **allocates questions per week following the section dependency order and front-loading Easy** problems."
- **Do:** Show the **weekly view**, then the **Today's questions** list (3–5 items).
- **Say:** "You get a week-by-week plan and a focused **'Today' list** of 3–5 items. **Spaced repetition** is built in — anything you grade Struggled or Failed resurfaces after 2, then 5, then 10 days."
- **Do:** Click **Rebalance**.
- **Say:** "If you fall behind or jump ahead, **Rebalance** regenerates the remaining weeks from your current progress — without losing your history."

---

# PART B — Code tour (technical audience) · ~2:30

Switch to the editor. Open files from the repo root. Commands below open or print each file (use whichever you have: `code`, `bat`, or `sed`).

> **The thread to pull:** one architectural idea explains the whole visualizer layer — *frames are data; the UI just plays them.* Pure generators produce `Frame[]`, a generic `<Stepper>` plays any frames, and the visual is injected via a prop. Everything else (storage, execution, planner) is a pure-logic seam behind an interface.

### 1. The Frame contract — `lib/types.ts`

```bash
code lib/types.ts                 # jump to `interface Frame` (~line 138)
# or: sed -n '138,157p' lib/types.ts
```

- **Highlight:** A `Frame` is plain data — `highlightLine`, `variables`, `caption`, `eli5Caption`, optional `pointers` / `cellStates` (array substrate), and an open `view` bag for non-array substrates (grid, heap tree, hash buckets, chart). "This one type is the contract between *every* algorithm and *every* visual."

### 2. A pure generator — `lib/algorithms/binarySearch.ts`

```bash
code lib/algorithms/binarySearch.ts
# or: sed -n '1,40p' lib/algorithms/binarySearch.ts
```

- **Highlight:** `binarySearchCode` is the code panel's lines (1-indexed, matched by `Frame.highlightLine`), and the generator returns `Frame[]`. **No React imports** — it's a pure function, which is why it's fully unit-testable. Point out the sibling `binarySearch.test.ts`; mention **91 tests pass** (`npm run test`), one suite per generator plus the planner.

### 3. The generic player — `components/visualizer/Stepper.tsx`

```bash
code components/visualizer/Stepper.tsx        # see the `renderStage` prop (~line 18)
```

- **Highlight:** `Stepper` takes `frames`, `codeLines`, and a **`renderStage(frame, index)` prop**. It owns Play/Pause/Step/Reset, the speed slider, and keyboard controls (←/→/space). It knows nothing about *what* it's drawing — the visual is **injected** via `renderStage`. This is the Strategy/dependency-inversion seam that lets one engine drive array cells, grids, trees, buckets, and charts.

### 4. How the 10 are wired — `registry.ts` + `VisualizerSwitch.tsx`

```bash
code lib/algorithms/registry.ts                  # the catalog (gallery + slug pages)
code components/visualizer/VisualizerSwitch.tsx   # slug → component/config
```

- **Highlight:** `registry.ts` is the **data-driven catalog** (slug, title, tagline, complexity, `implemented`) the gallery and routes read from. `VisualizerSwitch.tsx` maps a slug to its component — note that array-substrate visualizers (two-pointers, sliding-window, kadane, monotonic-stack) are **thin `<ArrayVisualizer>` configs** passing in just `codeLines`, a default array, and a `generate` fn; only the genuinely different substrates (heap, hash, big-o, grid) get dedicated components. "Adding a visualizer = author a generator + a thin config here."

### 5. The swappable persistence seam — `lib/storage.ts`

```bash
code lib/storage.ts            # `interface StorageAdapter` + `class LocalStorageAdapter`
```

- **Highlight:** Components never touch `localStorage` directly — they go through the **`StorageAdapter` interface** (Dependency Inversion). v1 ships `LocalStorageAdapter`; a DB/auth-backed adapter drops in later with **zero component changes**.

### 6. Code execution — `app/api/run/route.ts` + `lib/execution/wandbox.ts`

```bash
code app/api/run/route.ts            # POST handler: language allowlist + size caps
code lib/execution/wandbox.ts        # runCodeOnService → wandbox.org
```

- **Highlight:** `/api/run` **validates language against an allowlist and caps source/stdin size** before calling out (no arbitrary proxying). `wandbox.ts` isolates the provider behind `runCodeOnService` — keyless, and the `public class Main` → `class Main` rewrite lives here. Swapping in a self-hosted runner is a **one-file change**.

### 7. Planner logic — `lib/planner/`

```bash
ls lib/planner/                      # generatePlan, rebalance, spacedRepetition, today
code lib/planner/spacedRepetition.ts # reviewIntervalDays: 2 → 5 → 10 days
```

- **Highlight:** All **pure functions** — `generatePlan` orders the pool by section dependency and chunks into weeks; `spacedRepetition` encodes the 2/5/10-day intervals; `today` assembles the daily list. Pure logic = covered by `planner.test.ts`.

---

# Q&A / talking points appendix

**Q: Why one visualizer per *pattern*, not per *question*?**
A: A visualizer teaches the *technique* — binary search, sliding window, DFS — which transfers across dozens of problems. Per-question animations would be 110 one-offs with little reuse. Each question detail links to the relevant pattern visualizer instead, so the concept is taught once and reused everywhere.

**Q: Why Wandbox for code execution?**
A: It's a **keyless** public execution API, so there's no secret to manage and v1 needs no environment config. It supports both Python and Java. Critically, the provider is isolated behind `lib/execution/` (`runCodeOnService`) and the `/api/run` route validates/size-caps input — so swapping to a self-hosted runner later is a one-file change with the security boundary already in place.

**Q: How does user progress persist? What happens to it?**
A: Everything (status, self-grade history, scratchpad drafts, bookmarks, the study plan) lives in the browser's `localStorage`, accessed only through the `StorageAdapter` interface in `lib/storage.ts`. No data leaves the machine in v1. Because it's behind an interface, a database + auth layer can replace it without touching any component.

**Q: How do I add a new visualizer?**
A: Two steps. (1) Write a **pure frame generator** in `lib/algorithms/<algo>.ts` that returns `Frame[]` (plus its `codeLines`), with a unit test. (2) Add a **thin config** — register metadata in `registry.ts` and map the slug in `VisualizerSwitch.tsx` (an `<ArrayVisualizer>` config if it's array-based, otherwise a small dedicated stage component). The generic `<Stepper>` plays it for free. No animation loop, no new controls.

**Q: What's the complexity of the planner / spaced-repetition logic?**
A: Plan generation is **O(n)** in the number of questions — order the pool once by section dependency, then chunk into weeks (linear). Spaced repetition is **O(1)** per grade event (interval is a function of the poor-grade count: 2 → 5 → 10 days); assembling due reviews is **O(p)** over stored progress records. Nothing is worse than linear, so it scales fine well beyond 110 questions.

**Q: Is it accessible / production-ready?**
A: Targets: `next build` clean, Lighthouse performance > 90, keyboard-accessible (the Stepper is fully driven by ←/→/space), responsive down to ~380px, dark theme by default. 91 unit tests cover the frame generators and planner. Deploys to Vercel with no env vars in v1.
