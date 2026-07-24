// Outdent the selection by removing shared leading whitespace.
// Hold Command to strip all leading whitespace from every line.

const input = popclip.input.text;

if (popclip.modifiers.command) {
  return input
    .split("\n")
    .map((line) => (/^\s*$/.test(line) ? "" : line.replace(/^[ \t]+/, "")))
    .join("\n");
}

const leaders = input.match(/^[ \t]*/gm) ?? [];
let shortest: string | null = null;
for (const leader of leaders) {
  if (shortest === null || leader.length < shortest.length) {
    shortest = leader;
  }
}

if (shortest == null || shortest.length === 0) {
  return input;
}

const escaped = shortest.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
return input.replace(new RegExp(`^${escaped}`, "gm"), "");
