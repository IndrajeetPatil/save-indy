/**
 * Return a shuffled copy of `items` by sorting on independent random keys,
 * which gives every order the same chance.
 * @param items Items to shuffle; left unchanged.
 * @param random Source of uniform numbers in [0, 1), injectable for tests.
 * @returns A new array with the same items in random order.
 */
export function shuffle<Item>(
  items: readonly Item[],
  random: () => number = Math.random,
): Item[] {
  return items
    .map((item) => ({ item, key: random() }))
    .toSorted((first, second) => first.key - second.key)
    .map(({ item }) => item);
}
