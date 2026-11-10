const BACKTICK = "`";
/** Code spans need an opening and a closing backtick. */
const DELIMITERS_PER_SPAN = 2;

const isCodePart = (index: number) => index % DELIMITERS_PER_SPAN === 1;

/**
 * Fill an element with text, rendering `backtick`-delimited spans as inline
 * code. Text with an unpaired backtick (such as the answer "`") is shown as is.
 * Everything is inserted as text nodes, never parsed as HTML.
 * @param element Element to fill; its existing children are replaced.
 * @param text Text to show.
 */
export function setRichText(element: HTMLElement, text: string): void {
  const parts = text.split(BACKTICK);
  const backticks = parts.length - 1;
  if (backticks % DELIMITERS_PER_SPAN !== 0) {
    element.textContent = text;
    return;
  }
  const { ownerDocument } = element;
  element.replaceChildren(
    ...parts.map((part, index) => {
      if (!isCodePart(index)) {
        return ownerDocument.createTextNode(part);
      }
      const code = ownerDocument.createElement("code");
      code.textContent = part;
      return code;
    }),
  );
}
