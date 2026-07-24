// #popclip
// name: Comment
// identifier: com.brettterpstra.popclip.extension.comment
// description: Turn selected text into an HTML/code comment.
// icon: comment.png
// requirements: [paste]

function prefixLines(text: string, prefix: string): string {
  return text
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function wrapPreservingSpace(
  text: string,
  open: string,
  close: string,
  leadingTrailing: RegExp,
): string {
  const space = text.match(leadingTrailing);
  if (!space) {
    return `${open}${text.trim()}${close}`;
  }
  return `${space[1]}${open}${text.trim()}${close}${space[2]}`;
}

export const action = {
  requirements: ["paste"],
  submenu: [
    {
      title: "<!--",
      identifier: "html",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) =>
        wrapPreservingSpace(
          input.text,
          "<!-- ",
          " -->",
          /^([\s\n]*)\S.*?([\s\n]*)$/m,
        ),
    },
    {
      title: "/*",
      identifier: "css",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) =>
        wrapPreservingSpace(
          input.text,
          "/* ",
          " */",
          /^((?:\n\s*)*)\S.*?((?:\n\s*)*)$/m,
        ),
    },
    {
      title: "#",
      identifier: "hash",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) => prefixLines(input.text, "# "),
    },
    {
      title: "//",
      identifier: "slash",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) => prefixLines(input.text, "// "),
    },
  ],
};
