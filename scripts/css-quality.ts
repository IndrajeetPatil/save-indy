/**
 * CSS code quality check with @projectwallace/css-code-quality.
 *
 * Scores every stylesheet under src/ for performance, maintainability, and
 * complexity, and fails when any score drops below its threshold.
 */

import { glob, readFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";

import { calculate } from "@projectwallace/css-code-quality";

const DIMENSIONS = ["performance", "maintainability", "complexity"] as const;

type Dimension = (typeof DIMENSIONS)[number];
type Category = ReturnType<typeof calculate>[Dimension];

interface Source {
  file: string;
  css: string;
}

const THRESHOLDS: Readonly<Record<Dimension, number>> = {
  performance: 90,
  maintainability: 80,
  complexity: 90,
};
const LABEL_WIDTH = Math.max(...DIMENSIONS.map((name) => name.length));
const FAILURE_EXIT_CODE = 1;

function reportDimension(dimension: Dimension, category: Category): boolean {
  const threshold = THRESHOLDS[dimension];
  const passed = category.score >= threshold;
  const marker = passed ? styleText("green", "✓") : styleText("red", "✗");
  console.log(
    `  ${marker} ${dimension.padEnd(LABEL_WIDTH)}  ${category.score}/100 (min: ${threshold})`,
  );
  if (!passed) {
    for (const violation of category.violations) {
      console.log(
        `      ↳ ${violation.id}: −${violation.score} pts (value: ${violation.value})`,
      );
    }
  }
  return passed;
}

function reportSource({ file, css }: Source): boolean {
  const result = calculate(css);
  console.log(`\n${path.relative(process.cwd(), file)} (scores out of 100)`);
  // Map before `every` so each dimension is reported, even after a failure.
  return DIMENSIONS.map((dimension) =>
    reportDimension(dimension, result[dimension]),
  ).every(Boolean);
}

function fail(message: string): void {
  console.error(styleText("red", message));
  process.exitCode = FAILURE_EXIT_CODE;
}

const files = await Array.fromAsync(glob("src/**/*.css"));
const sources = await Promise.all(
  files
    .toSorted((left, right) => left.localeCompare(right))
    .map(async (file) => ({ file, css: await readFile(file, "utf8") })),
);
if (sources.length === 0) {
  fail("No CSS files found under src/.");
} else if (sources.map((source) => reportSource(source)).every(Boolean)) {
  console.log(styleText("green", "\nCSS quality check passed."));
} else {
  fail("\nCSS quality check failed.");
}
