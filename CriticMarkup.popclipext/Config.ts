// #popclip
// name: CriticMarkup
// identifier: com.brettterpstra.popclip.extension.criticmarkup
// description: Insert CriticMarkup
// icon: icon.png
// requirements: [paste]
// popclipVersion: 5997
// keywords: critic editing editor markdown

type CriticOptions = {
  criticmarkupcomment?: string;
};

function formatLocalTimestamp(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function signatureMarkup(signature: string): string {
  if (!signature) return "";
  return `{>>${signature} - ${formatLocalTimestamp()}<<}`;
}

function signature(options: CriticOptions): string {
  return String(options.criticmarkupcomment ?? "");
}

export const options = [
  {
    identifier: "criticmarkupcomment",
    type: "string",
    label: "Signature",
  },
];

export const action = {
  requirements: ["paste"],
  submenu: [
    {
      title: "Highlight",
      identifier: "highlight",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: CriticOptions) =>
        `{==${input.text}==}${signatureMarkup(signature(options))}`,
    },
    {
      title: "Delete",
      identifier: "delete",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: CriticOptions) =>
        `{--${input.text}--}${signatureMarkup(signature(options))}`,
    },
    {
      title: "Insert",
      identifier: "insert",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: CriticOptions) =>
        `{++${input.text}++}${signatureMarkup(signature(options))}`,
    },
    {
      title: "Change",
      identifier: "change",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: CriticOptions) =>
        `{~~${input.text}~> ~~}${signatureMarkup(signature(options))}`,
    },
    {
      title: "Comment",
      identifier: "comment",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }, options: CriticOptions) =>
        `{>>${signature(options)}: ${input.text}<<}`,
    },
  ],
};
