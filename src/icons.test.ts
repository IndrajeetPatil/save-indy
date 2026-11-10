import { describe, expect, test } from "vite-plus/test";

import { fillIcons, iconText, makeIcon } from "./icons.ts";

describe(makeIcon, () => {
  test("draws a decorative SVG that assistive technology skips", () => {
    const icon = makeIcon(document, "github");

    expect({
      hidden: icon.getAttribute("aria-hidden"),
      paths: icon.querySelectorAll("path").length > 0,
    }).toStrictEqual({ hidden: "true", paths: true });
  });
});

describe(fillIcons, () => {
  test("replaces known placeholders and leaves unknown ones alone", () => {
    const known = document.createElement("span");
    known.dataset["icon"] = "bug";
    const unknown = document.createElement("span");
    unknown.dataset["icon"] = "dragon";
    document.body.replaceChildren(known, unknown);

    fillIcons(document);

    expect(document.body.querySelectorAll("svg.icon")).toHaveLength(1);
    expect(document.body.contains(unknown)).toBe(true);
  });
});

describe(iconText, () => {
  test("reads as text, with the hidden part for screen readers", () => {
    const paragraph = document.createElement("p");

    paragraph.append(
      ...iconText(document, { icon: "check", hidden: "Answer: ", text: "`1`" }),
    );

    expect(paragraph.textContent).toBe("Answer: 1");
    expect(paragraph.querySelector("code")?.textContent).toBe("1");
  });
});
