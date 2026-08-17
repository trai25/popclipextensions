// #popclip
// name: MDList
// identifier: com.brettterpstra.popclip.extension.mdlist
// description: Turn lines into Markdown bullet or numbered lists, or clear list markers.
// icon: bulletlist.png
// requirements: [paste]
// keywords: markdown list bullet numbered
// popclipVersion: 5997
type ListMode = "bullet" | "numbered" | "clear";

const BULLET_CYCLE = ["*", "-", "+"] as const;

function bulletMarkerForLevel(level: number): string {
  return BULLET_CYCLE[level % BULLET_CYCLE.length];
}

function formatList(text: string, mode: ListMode): string {
  const lastMarker: Record<number, string> = { 0: "" };
  let lastLeadingSpace = "";
  let listLevel = 0;
  const output: string[] = [];

  for (let line of text.split("\n")) {
    if (/^[ \t]*$/.test(line)) continue;

    if (mode === "clear") {
      line = line.replace(/^([ \t]*)(\d+\. |[*+-] )?\s*(.*)$/, "$1$3");
      output.push(line);
      continue;
    }

    if (mode === "numbered") {
      line = line.replace(/^([ \t]*)(\d+\. |[*+-] )?/, "$11. ");
    } else {
      line = line.replace(/^([ \t]*)(\d+\. |[*+-] )?/, "$1* ");
    }

    const parsed = line.match(/^([ \t]*)([*+-]|\d+\.)(\.?\s*)(.*)/);
    if (!parsed) {
      output.push(line);
      continue;
    }

    let leadingSpace = parsed[1].replace(/\t/g, "    ");
    let marker = parsed[2];
    const item = ` ${parsed[4]}`;

    if (!/^([ \t]*)([*+-]|\d+\.)/.test(line)) {
      output.push(line);
      marker = lastMarker[listLevel] ?? "";
    } else if (leadingSpace.length > lastLeadingSpace.length + 3) {
      listLevel += 1;
      marker =
        mode === "numbered"
          ? marker.replace(/\d+/, "1")
          : bulletMarkerForLevel(listLevel);
      lastLeadingSpace = leadingSpace;
      output.push("\t".repeat(listLevel) + marker + item);
    } else if (leadingSpace.length + 3 < lastLeadingSpace.length) {
      listLevel = Math.floor(leadingSpace.length / 4);
      if (mode === "numbered") {
        marker = lastMarker[listLevel] ?? marker;
        marker = marker.replace(/\d+/, (n) => String(parseInt(n, 10) + 1));
      } else {
        marker = bulletMarkerForLevel(listLevel);
      }
      lastLeadingSpace = leadingSpace;
      output.push("\t".repeat(listLevel) + marker + item);
    } else {
      if (mode === "numbered") {
        if ((lastMarker[listLevel] ?? "") !== "") {
          marker = lastMarker[listLevel];
          marker = marker.replace(/\d+/, (n) => String(parseInt(n, 10) + 1));
        }
      } else {
        marker = bulletMarkerForLevel(listLevel);
      }
      lastLeadingSpace = leadingSpace;
      output.push("\t".repeat(listLevel) + marker + item);
    }

    lastMarker[listLevel] = marker;
  }

  return output.join("\n");
}

export const action = {
  requirements: ["paste"],
  submenu: [
    {
      title: "*",
      identifier: "bullet",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) => formatList(input.text, "bullet"),
    },
    {
      title: "1.",
      identifier: "numbered",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) => formatList(input.text, "numbered"),
    },
    {
      title: "X",
      identifier: "clear",
      requirements: ["paste"],
      after: "paste-result",
      code: (input: { text: string }) => formatList(input.text, "clear"),
    },
  ],
};
