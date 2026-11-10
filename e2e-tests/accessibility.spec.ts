import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { answerQuestion, playToEnd, startGame } from "./game-fixture.ts";

// Every WCAG 2.2 A/AA rule plus axe best practices, for each screen of the
// game, on desktop and mobile layouts.
const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function expectNoViolations(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .analyze();
  expect(
    violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target.join(" ")),
    })),
  ).toStrictEqual([]);
}

const STATES: Record<string, (page: Page) => Promise<void>> = {
  "level picker": async (page) => {
    await page.goto("/");
  },
  question: async (page) => {
    await startGame(page);
  },
  "answer feedback": async (page) => {
    await startGame(page);
    await answerQuestion(page, false);
  },
  "win screen": async (page) => {
    await startGame(page);
    await playToEnd(page, true);
  },
  "loss screen with review": async (page) => {
    await startGame(page);
    await playToEnd(page, false);
  },
};

const LAYOUTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
} as const;

for (const [layout, viewport] of Object.entries(LAYOUTS)) {
  test.describe(`${layout} layout`, () => {
    test.use({ viewport });

    for (const [state, reach] of Object.entries(STATES)) {
      test(`${state} has no accessibility violations`, async ({ page }) => {
        await reach(page);

        await expectNoViolations(page);
      });
    }
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("disables the meter animation", async ({ page }) => {
    await page.goto("/");

    const transition = await page
      .locator(".meter-fill")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration);

    expect(transition).toBe("0s");
  });
});
