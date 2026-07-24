const axios = require("axios");

const urlPattern =
  /((?:(?:http|https):\/\/)?[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-\.,@?^=%&:\/~\+#\(\)_]*[\w\-\@^=%&\/~\+#\(\)])?)/gi;

async function stretchlinkClean(url, tidyAmazon) {
  const target = /^http/i.test(url) ? url : `http://${url}`;
  const { data } = await axios.get("https://stretchlink.cc/api/1/", {
    params: {
      u: target,
      c: "1",
      t: tidyAmazon ? "1" : "0",
      o: "text",
    },
  });
  const res = String(data).trim();
  return res.length ? res : url;
}

const input = popclip.input.text;
const tidyAmazon = Boolean(popclip.options.tidyamazon);
const matches = [...input.matchAll(urlPattern)];
const cleanedUrls = [];

for (const match of matches) {
  cleanedUrls.push(await stretchlinkClean(match[0], tidyAmazon));
}

let i = 0;
const replaced = input.replace(urlPattern, () => cleanedUrls[i++]);
const urlsOnly = popclip.modifiers.command && popclip.modifiers.option;
const output = urlsOnly ? cleanedUrls.join("\n") : replaced;

if (popclip.modifiers.command) {
  popclip.copyText(output);
} else {
  popclip.pasteText(output);
}
