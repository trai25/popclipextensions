// #popclip
// name: HardWrap
// identifier: com.brettterpstra.popclip.extension.hardwrap
// description: Add and remove hard wrapping of paragraphs.
// icon: hardwrap.png
// requirements: [paste]

type HardWrapOptions = {
  column?: string | number;
};

function columnWidth(options: HardWrapOptions): number {
  const n = parseInt(String(options.column ?? "80"), 10);
  return Number.isFinite(n) && n > 0 ? n : 80;
}

function trailingWhitespace(text: string): string {
  const match = text.match(/[\s\n\t]+$/i);
  return match ? match[0] : "";
}

function wrap(text: string, col: number): string {
  const re = new RegExp(`(.{1,${col}})( +|$)\\n?|(.{${col}})`, "g");
  return text.replace(re, "$1$3\n").trim();
}

function unwrapParagraph(para: string): string {
  let result = para;
  let previous: string;
  do {
    previous = result;
    result = result.replace(/(\S *)\n( *\S)/g, "$1 $2");
  } while (result !== previous);
  return result;
}

function unwrap(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(unwrapParagraph)
    .join("\n\n")
    .trim();
}

export const options = [
  {
    identifier: "column",
    type: "string",
    label: "Column",
    defaultValue: "80",
  },
];

export const action = {
  requirements: ["paste"],
  submenu: [
    {
      title: "Wrap",
      identifier: "wrap",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: HardWrapOptions) => {
        const trailing = trailingWhitespace(input.text);
        return wrap(input.text, columnWidth(options)) + trailing;
      },
    },
    {
      title: "Unwrap",
      identifier: "unwrap",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) => {
        const trailing = trailingWhitespace(input.text);
        return unwrap(input.text) + trailing;
      },
    },
  ],
};
