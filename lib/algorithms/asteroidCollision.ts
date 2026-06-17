import type { CellState, Frame } from "@/lib/types";

// Pure frame generator for Asteroid Collision. A stack holds surviving
// asteroids (bottom-to-top). A left-moving (negative) asteroid collides with
// right-moving (positive) ones on top of the stack. Two rows: the input and the
// stack, carried in `view`. No React.
//
// `asteroidCollisionCode` is 1-indexed by `Frame.highlightLine`.

export const asteroidCollisionCode = [
  "stack = []", // 1
  "for a in asteroids:", // 2
  "    alive = True", // 3
  "    while alive and a < 0 and stack and stack[-1] > 0:", // 4
  "        if stack[-1] < -a:", // 5
  "            stack.pop(); continue      # top explodes", // 6
  "        if stack[-1] == -a: stack.pop()  # both explode", // 7
  "        alive = False", // 8
  "    if alive: stack.append(a)", // 9
  "return stack", // 10
];

/** Two-row payload (input asteroids + the survivor stack). A `type` (not
 *  `interface`) so it's assignable to Frame.view's Record type. */
export type AsteroidView = {
  asteroids: number[];
  astStates: CellState[];
  stack: number[];
  stackStates: CellState[];
};

export interface AsteroidCollisionResult {
  frames: Frame[];
  /** Surviving asteroids, bottom-to-top. */
  result: number[];
}

/**
 * Generate frames for Asteroid Collision. Push each asteroid; when a left-mover
 * meets right-movers on the stack, the smaller explodes (equal → both). The
 * current asteroid keeps colliding until it dies or clears the right-movers.
 *
 * Time:  O(n) — each asteroid is pushed and popped at most once.
 * Space: O(n) — the stack plus one frame per step.
 */
export function asteroidCollisionFrames(asteroids: number[]): AsteroidCollisionResult {
  const ast = [...asteroids];
  const n = ast.length;
  const frames: Frame[] = [];
  const stack: number[] = [];

  const astStates = (i: number): CellState[] =>
    ast.map((_, k) => (k === i ? "current" : k < i ? "visited" : "default"));

  const stackStates = (): CellState[] =>
    stack.map((_, k) => (k === stack.length - 1 ? "current" : "active"));

  const snap = (i: number): AsteroidView => ({
    asteroids: [...ast],
    astStates: astStates(i),
    stack: [...stack],
    stackStates: stackStates(),
  });

  frames.push({
    highlightLine: 1,
    pointers: {},
    cellStates: [],
    variables: { stack: "[]" },
    caption: `Empty stack. Push asteroids; left-movers (negative) collide with right-movers on top.`,
    eli5Caption: `Keep a stack of asteroids flying right. A left-flying one smashes into them.`,
    view: snap(-1),
  });

  for (let i = 0; i < n; i++) {
    const a = ast[i];
    let alive = true;

    while (alive && a < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -a) {
        stack.pop();
        frames.push({
          highlightLine: 6,
          pointers: { i },
          cellStates: [],
          variables: { i, a, top, stack: `[${stack.join(",")}]` },
          caption: `|${a}| > ${top} → the ${top} explodes (pop). ${a} keeps going.`,
          eli5Caption: `The incoming ${a} is bigger than ${top}, so ${top} blows up and ${a} flies on.`,
          view: snap(i),
        });
        continue;
      }
      if (top === -a) {
        stack.pop();
        frames.push({
          highlightLine: 7,
          pointers: { i },
          cellStates: [],
          variables: { i, a, top, stack: `[${stack.join(",")}]` },
          caption: `${top} == |${a}| → equal sizes, both explode.`,
          eli5Caption: `Same size — ${top} and ${a} destroy each other.`,
          view: snap(i),
        });
      } else {
        frames.push({
          highlightLine: 8,
          pointers: { i },
          cellStates: [],
          variables: { i, a, top, stack: `[${stack.join(",")}]` },
          caption: `${top} > |${a}| → the bigger ${top} survives; ${a} explodes.`,
          eli5Caption: `${top} is bigger, so it survives and ${a} is destroyed.`,
          view: snap(i),
        });
      }
      alive = false;
    }

    if (alive) {
      stack.push(a);
      frames.push({
        highlightLine: 9,
        pointers: { i },
        cellStates: [],
        variables: { i, a, stack: `[${stack.join(",")}]` },
        caption: `${a} survives — push it onto the stack.`,
        eli5Caption: `Nothing destroys ${a}, so it joins the survivors.`,
        view: snap(i),
      });
    }
  }

  frames.push({
    highlightLine: 10,
    pointers: {},
    cellStates: [],
    variables: { result: `[${stack.join(",")}]` },
    caption: `All collisions resolved. Survivors: [${stack.join(", ")}].`,
    eli5Caption: `The asteroids left standing: [${stack.join(", ")}].`,
    view: snap(-1),
  });

  return { frames, result: [...stack] };
}
