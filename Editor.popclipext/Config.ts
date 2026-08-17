// #popclip
// name: Editor
// identifier: com.brettterpstra.popclip.extension.editor
// description: Adds ins, del and mark tags to text
// icon: icon.png
// requirements: [paste]
// popclipVersion: 5997
// keywords: editor html ins del

type EditorOptions = {
  includedatetime?: boolean | string | number;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Ruby Time#strftime(' datetime="%FT%T%z"') */
function datetimeAttribute(): string {
  const d = new Date();
  const offsetMinutes = -d.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const offset =
    sign + pad(Math.floor(abs / 60)) + pad(abs % 60);
  return ` datetime="${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${offset}"`;
}

function includeDatetime(options: EditorOptions): boolean {
  const value = options.includedatetime;
  return value === true || value === 1 || value === "1";
}

function wrapPreservingSpace(
  text: string,
  open: string,
  close: string,
): string {
  const space = text.match(/^([\s\n]*)\S.*?([\s\n]*)$/m);
  if (!space) {
    return `${open}${text.trim()}${close}`;
  }
  return `${space[1]}${open}${text.trim()}${close}${space[2]}`;
}

export const options = [
  {
    identifier: "includedatetime",
    type: "boolean",
    label: "Include Datetime",
    defaultValue: true,
  },
];

export const action = {
  requirements: ["paste"],
  submenu: [
    {
      title: "mark",
      identifier: "mark",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) =>
        wrapPreservingSpace(input.text, "<mark>", "</mark>"),
    },
    {
      title: "ins",
      identifier: "insert",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: EditorOptions) => {
        const date = includeDatetime(options) ? datetimeAttribute() : "";
        return wrapPreservingSpace(input.text, `<ins${date}>`, "</ins>");
      },
    },
    {
      title: "del",
      identifier: "delete",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: EditorOptions) => {
        const date = includeDatetime(options) ? datetimeAttribute() : "";
        return wrapPreservingSpace(input.text, `<del${date}>`, "</del>");
      },
    },
    {
      title: "Comment",
      identifier: "comment",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) =>
        wrapPreservingSpace(input.text, "<!-- ", " -->"),
    },
  ],
};
