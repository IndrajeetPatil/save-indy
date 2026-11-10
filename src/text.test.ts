import { describe, expect, test } from "vite-plus/test";

import { setRichText } from "./text.ts";

const render = (text: string) => {
  const element = document.createElement("p");
  setRichText(element, text);
  return element;
};

describe(setRichText, () => {
  test("renders backtick spans as inline code", () => {
    const element = render("What is `typeof NaN`?");

    expect(element.textContent).toBe("What is typeof NaN?");
    expect(element.querySelector("code")?.textContent).toBe("typeof NaN");
  });

  test("shows text with an unpaired backtick verbatim", () => {
    const element = render("`");

    expect(element.textContent).toBe("`");
    expect(element.querySelector("code")).toBeNull();
  });

  test("never parses markup", () => {
    const element = render("`<img src=x onerror=alert(1)>` <b>bold</b>");

    expect(element.querySelector("img, b")).toBeNull();
    expect(element.textContent).toBe(
      "<img src=x onerror=alert(1)> <b>bold</b>",
    );
  });

  test("replaces earlier content", () => {
    const element = render("first");
    setRichText(element, "second");

    expect(element.textContent).toBe("second");
  });
});
