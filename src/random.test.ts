import { describe, expect, test } from "vite-plus/test";

import { shuffle } from "./random.ts";

const fromList = (values: readonly number[]) => {
  const queue = [...values];
  return () => queue.shift() ?? 0;
};

describe(shuffle, () => {
  test("keeps every item and leaves the input untouched", () => {
    const items = [1, 2, 3, 4, 5];

    const result = shuffle(items);

    expect(result.toSorted((first, second) => first - second)).toStrictEqual(
      items,
    );
    expect(items).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("orders items by the random keys it draws", () => {
    const result = shuffle(["a", "b", "c"], fromList([0.9, 0.1, 0.5]));

    expect(result).toStrictEqual(["b", "c", "a"]);
  });
});
