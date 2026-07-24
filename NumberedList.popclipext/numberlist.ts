// Turn lines into a Markdown numbered list.
// Renumbers existing numbered items and converts bullets to numbers.
// Nesting uses 4-space (or tab) indents; output uses tabs.

const lastMarker: Record<number, string> = { 0: "" };
let lastLeadingSpace = "";
let listLevel = 0;

const lines = popclip.input.text.split("\n");
const output: string[] = [];

for (let line of lines) {
  if (/^[ \t]*$/.test(line)) continue;

  // Normalize to a numbered marker (convert bullets / renumber later)
  line = line.replace(/^([ \t]*)(\d+\. |[*+-] )?/, "$11. ");

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
    // Deeper nest level
    listLevel += 1;
    marker = marker.replace(/\d+/, "1");
    lastLeadingSpace = leadingSpace;
    output.push("\t".repeat(listLevel) + marker + item);
  } else if (leadingSpace.length + 3 < lastLeadingSpace.length) {
    // Shallower nest level
    listLevel = Math.floor(leadingSpace.length / 4);
    marker = lastMarker[listLevel] ?? marker;
    marker = marker.replace(/\d+/, (n) => String(parseInt(n, 10) + 1));
    lastLeadingSpace = leadingSpace;
    output.push("\t".repeat(listLevel) + marker + item);
  } else {
    // Same level — increment number when continuing a list
    if ((lastMarker[listLevel] ?? "") !== "") {
      marker = lastMarker[listLevel];
      marker = marker.replace(/\d+/, (n) => String(parseInt(n, 10) + 1));
    }
    lastLeadingSpace = leadingSpace;
    output.push("\t".repeat(listLevel) + marker + item);
  }

  lastMarker[listLevel] = marker;
}

return output.join("\n");
