// Open all URLs found in the selection.
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
  popclip.openUrl(target);
}
