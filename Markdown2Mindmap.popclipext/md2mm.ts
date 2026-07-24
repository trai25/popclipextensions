// Convert Markdown headings/lists/paragraphs into a tab-indented outline
// for pasting into mind-mapping apps.

function outdent(text: string): string {
  const leaders = text.match(/^[ \t]*/gm) ?? [];
  let shortest: string | null = null;
  for (const leader of leaders) {
    if (shortest === null || leader.length < shortest.length) {
      shortest = leader;
    }
  }
  if (shortest == null || shortest.length === 0) {
    return text.trim();
  }
  const re = new RegExp(`^${shortest.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "gm");
  return text.replace(re, "").trim();
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/** Detect whether list nesting uses 2-space or 4-space indents. */
function detectSpaceIndentUnit(lines: string[]): 2 | 4 {
  const spaceIndents: number[] = [];
  for (const line of lines) {
    const match = line.match(/^([ \t]*)(?:\d+\.|[-*+])(?:\s|$)/);
    if (!match) continue;
    const lead = match[1];
    // Skip tab indents and top-level items when probing space width
    if (lead.includes("\t") || lead.length === 0) continue;
    if (/^ +$/.test(lead)) {
      spaceIndents.push(lead.length);
    }
  }

  if (spaceIndents.length === 0) return 4;

  const unit = spaceIndents.reduce((a, b) => gcd(a, b));
  if (unit > 0 && unit <= 2) return 2;
  if (unit >= 4) return 4;
  return spaceIndents.some((n) => n % 4 !== 0) ? 2 : 4;
}

/**
 * Convert leading indentation to tabs.
 * Existing tabs are kept as one level each; space runs use the detected unit.
 */
function leadingToTabs(leading: string, unit: 2 | 4): string {
  if (leading.length === 0) return "";
  if (!leading.includes(" ")) return leading; // tabs only — leave alone

  let levels = 0;
  let i = 0;
  while (i < leading.length) {
    const ch = leading[i];
    if (ch === "\t") {
      levels += 1;
      i += 1;
    } else if (ch === " ") {
      let spaces = 0;
      while (i < leading.length && leading[i] === " ") {
        spaces += 1;
        i += 1;
      }
      levels += Math.floor(spaces / unit);
    } else {
      break;
    }
  }
  return "\t".repeat(levels);
}

function convertLine(
  line: string,
  lastLevel: number,
  indentUnit: 2 | 4,
): { text: string; level: number } {
  const heading = line.match(/^(#{1,6})\s+(.*)$/);
  if (heading) {
    const depth = heading[1].length;
    return {
      text: "\t".repeat(depth - 1) + heading[2],
      level: depth,
    };
  }

  const list = line.match(/^([ \t]*)(?:\d+\.|[-*+])\s+(.*)$/);
  if (list) {
    const indent = leadingToTabs(list[1], indentUnit);
    return {
      text: "\t".repeat(lastLevel) + indent + list[2],
      level: lastLevel,
    };
  }

  // Plain paragraph / continuation under the current heading level
  const leadMatch = line.match(/^([ \t]*)(.*)$/);
  const leading = leadMatch ? leadMatch[1] : "";
  const body = leadMatch ? leadMatch[2] : line;
  const indent = leadingToTabs(leading, indentUnit);
  return {
    text: "\t".repeat(lastLevel) + indent + body,
    level: lastLevel,
  };
}

const lines = outdent(popclip.input.text)
  .split("\n")
  .filter((line) => !/^\s*$/.test(line));

const indentUnit = detectSpaceIndentUnit(lines);

let lastLevel = 0;
const converted = lines.map((line) => {
  const result = convertLine(line, lastLevel, indentUnit);
  lastLevel = result.level;
  return result.text;
});

return outdent(converted.join("\n")).trim();
