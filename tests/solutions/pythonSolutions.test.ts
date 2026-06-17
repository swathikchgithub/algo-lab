import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { getQuestion } from "@/data/questions";
import { PYTHON_SOLUTION_CASES, type SolutionCase, type SolutionSpec } from "@/lib/execution/solutionCases";

// Verifies that the Python solution code SHOWN to learners actually runs and
// returns the right answer. Runs each `solutions.python` through the local
// `python3` interpreter against the cases in solutionCases.ts.
//
// Kept out of the fast unit suite (run with `npm run test:solutions`) because it
// shells out to an external interpreter — slower and environment-dependent.

// Injected for tree questions: a standard LeetCode TreeNode + level-order builder.
const TREE_PREAMBLE = `
from collections import deque as _deque
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right
def _build_tree(vals):
    if not vals or vals[0] is None: return None
    root = TreeNode(vals[0]); q = _deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i]); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i]); q.append(node.right)
        i += 1
    return root
`;

/** Build a self-checking Python program: the solution + a driver that compares.
 *  For in-place functions, the mutated first argument is the result. For the
 *  "tree" adapter, the first arg (a level-order list) is built into a TreeNode. */
function buildProgram(
  solution: string,
  fn: string,
  inPlace: boolean,
  adapter: SolutionSpec["adapter"],
  { args, expected }: SolutionCase,
): string {
  // Args/expected travel as JSON and are parsed Python-side, so list/number
  // values compare exactly without any JS→Python literal translation.
  const argsJson = JSON.stringify(args);
  const expectedJson = JSON.stringify(expected);
  const preamble = adapter === "tree" ? TREE_PREAMBLE : "";
  const call = adapter === "tree" ? `${fn}(_build_tree(_args[0]))` : `${fn}(*_args)`;
  const got = inPlace ? "_args[0]" : "_ret";
  return `${solution}
${preamble}
import json
_args = json.loads(r'''${argsJson}''')
_expected = json.loads(r'''${expectedJson}''')
_ret = ${call}
_got = ${got}
print("PASS" if _got == _expected else "FAIL got=" + repr(_got) + " expected=" + repr(_expected))
`;
}

/** Run a Python program and return trimmed stdout. Fails loudly if python3 is absent. */
function runPython(program: string): string {
  try {
    return execFileSync("python3", ["-"], { input: program, encoding: "utf8" }).trim();
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { stderr?: Buffer };
    if (e.code === "ENOENT") {
      throw new Error("python3 not found on PATH — required for the solution suite.");
    }
    throw new Error(e.stderr?.toString() || e.message);
  }
}

describe("displayed Python solutions are correct", () => {
  for (const [id, spec] of Object.entries(PYTHON_SOLUTION_CASES)) {
    const question = getQuestion(id);

    it(`${id}: question exists with a Python solution`, () => {
      expect(question, `no question with id "${id}"`).toBeDefined();
      expect(question!.solutions.python).toContain(`def ${spec.fn}`);
    });

    spec.cases.forEach((testCase) => {
      it(`${id}: ${spec.fn}(${JSON.stringify(testCase.args)}) === ${JSON.stringify(testCase.expected)}`, () => {
        const program = buildProgram(
          question!.solutions.python,
          spec.fn,
          spec.inPlace ?? false,
          spec.adapter,
          testCase,
        );
        expect(runPython(program)).toBe("PASS");
      });
    });
  }
});
