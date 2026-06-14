import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { getQuestion } from "@/data/questions";
import { PYTHON_SOLUTION_CASES, type SolutionCase } from "@/lib/execution/solutionCases";

// Verifies that the Python solution code SHOWN to learners actually runs and
// returns the right answer. Runs each `solutions.python` through the local
// `python3` interpreter against the cases in solutionCases.ts.
//
// Kept out of the fast unit suite (run with `npm run test:solutions`) because it
// shells out to an external interpreter — slower and environment-dependent.

/** Build a self-checking Python program: the solution + a driver that compares. */
function buildProgram(solution: string, fn: string, { args, expected }: SolutionCase): string {
  // Args/expected travel as JSON and are parsed Python-side, so list/number
  // values compare exactly without any JS→Python literal translation.
  const argsJson = JSON.stringify(args);
  const expectedJson = JSON.stringify(expected);
  return `${solution}

import json
_args = json.loads(r'''${argsJson}''')
_expected = json.loads(r'''${expectedJson}''')
_got = ${fn}(*_args)
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
        const program = buildProgram(question!.solutions.python, spec.fn, testCase);
        expect(runPython(program)).toBe("PASS");
      });
    });
  }
});
