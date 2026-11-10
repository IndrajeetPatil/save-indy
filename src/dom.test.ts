import { describe, expect, test } from "vite-plus/test";

import { byId, make } from "./dom.ts";

describe(byId, () => {
  test("finds an element of the expected type", () => {
    const button = make(document, "button", "action");
    button.id = "found";
    document.body.replaceChildren(button);

    expect(byId(document, "found", HTMLButtonElement)).toBe(button);
  });

  test("fails loudly when the element is missing or of another type", () => {
    document.body.replaceChildren(make(document, "div", "other"));

    expect(() => byId(document, "missing", HTMLElement)).toThrow(/#missing/u);
  });
});
