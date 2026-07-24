// Extract URLs from the selection and copy them as a newline-separated list.
// Hold Option to join lines first (helps with URLs broken across line breaks).

const urlPattern =
  /((?:(?:http|https):\/\/)?[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-\.,@?^=%&:\/~\+#\(\)_]*[\w\-\@^=%&\/~\+#\(\)])?)/gi;

let input = popclip.input.text;

if (popclip.modifiers.option) {
  input = input
    .split(/[\n\r]/)
    .map((line) => (line === "" ? "\n" : line))
    .join("");
}

const urls: string[] = [];

for (const match of input.matchAll(urlPattern)) {
  let url = match[0];

  // Skip pure numeric dotted sequences (e.g. version-like 1.2.3)
  if (/^[\d.]+$/.test(url)) {
    continue;
  }

  // If a trailing ")" was captured without a matching "(", drop from ")" onward
  if (url.includes(")") && !url.includes("(")) {
    url = url.replace(/\).*?$/, "");
  }

  const target = /^http/i.test(url) ? url : `http://${url}`;
  urls.push(target);
}

return urls.map((u) => `${u}\n`).join("");
