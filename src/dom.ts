/**
 * Look up an element by id and check its type, so a renamed id fails loudly
 * at start-up instead of silently later.
 * @param root Document to search.
 * @param id Element id.
 * @param type Expected element class.
 * @returns The element.
 */
export function byId<Wanted extends HTMLElement>(
  root: Document,
  id: string,
  type: new () => Wanted,
): Wanted {
  const element = root.querySelector(`#${id}`);
  if (!(element instanceof type)) {
    throw new TypeError(`Expected #${id} to be a ${type.name}.`);
  }
  return element;
}

/**
 * Create an element with a class name.
 * @param root Document that owns the element.
 * @param tag Tag name.
 * @param className Space-separated classes.
 * @returns The new element.
 */
export function make<Tag extends keyof HTMLElementTagNameMap>(
  root: Document,
  tag: Tag,
  className: string,
): HTMLElementTagNameMap[Tag] {
  const element = root.createElement(tag);
  element.className = className;
  return element;
}
