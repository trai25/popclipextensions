// Convert selection to Markdown inline code or a fenced code block.
// If the selection already contains code markup, strip it (toggle).

const input = popclip.input.text;

if (/(`+).*?\1/ms.test(input)) {
  return input.replace(/(`+)\n?(.*?)\n?\1/ms, "$2");
}

if (input.split("\n").length > 1) {
  return `\`\`\`\n${input}\n\`\`\`\n`;
}

const headMatch = input.match(/^(\s+)/);
const tailMatch = input.match(/(\s+)$/);
const head = headMatch ? headMatch[1] : "";
const tail = tailMatch ? tailMatch[1] : "";
return `${head}\`${input.trim()}\`${tail}`;
