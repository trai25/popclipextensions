// Turn indented text into nested Markdown blockquotes.
// Command: decrease quote level by one
// Command-Option: remove all quoting

function quoteBlock(lines: string[]): string {
  const input = [...lines];
  while (input.length > 0 && /^\s*$/.test(input[input.length - 1])) {
    input.pop();
  }

  let output = "";
  for (const line of input) {
    let quote = ">";
    const tabs = line.match(/^([\s\t]+)/);

    if (tabs) {
      const count = Math.floor(tabs[1].replace(/\t/g, "    ").length / 4);
      for (let i = 0; i < count; i++) {
        quote += " >";
      }
    }

    // don't quote reference definitions
    if (/^\s*\[.*?\]: .*/.test(line)) {
      output += line;
    } else if (/^\s*$/.test(line)) {
      output += `${quote}\n`;
    } else {
      output += `${quote} ${line.replace(/^[\s\t]*/, "")}\n`;
    }
  }
  return output;
}

function increaseQuoteLevel(lines: string[]): string[] {
  const output: string[] = [];
  let block: string[] = [];
  let skipping = false;

  lines.forEach((line, i) => {
    if (/\S/.test(line) && skipping) {
      skipping = false;
      block = [line];
    } else if (
      /^\s*$/.test(line) &&
      (/^\s*$/.test(lines[i + 1] ?? "") || i === lines.length - 1) &&
      !skipping
    ) {
      skipping = true;
      if (block.length > 0) {
        output.push(quoteBlock(block));
      }
      block = [];
    } else if (/^\s*$/.test(line) && skipping) {
      return;
    } else {
      block.push(line);
    }
  });

  if (block.length > 0) {
    output.push(quoteBlock(block));
  }

  return output;
}

const trailMatch = popclip.input.text.match(/[\s\n\t]+$/i);
const trailing = trailMatch ? trailMatch[0] : "";
const lines = popclip.input.text.split("\n");
let output: string[];

if (popclip.modifiers.command && popclip.modifiers.option) {
  // Option-Command: remove all blockquoting
  output = lines.map((line) => line.replace(/^(\s*)(>\s*)*/, "$1"));
} else if (popclip.modifiers.command) {
  // Command: remove one level of blockquoting
  output = lines.map((line) => line.replace(/^(\s*)>\s*/, "$1"));
} else {
  output = increaseQuoteLevel(lines);
}

return output.join("\n") + trailing;
