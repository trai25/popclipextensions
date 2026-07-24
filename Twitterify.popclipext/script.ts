// Convert @names and #hashtags to Twitter links (Markdown or HTML).
// Option flips the configured Markdown Links setting for this run.

type TwitterifyOptions = {
  usemarkdown?: boolean | string | number;
};

function useMarkdown(options: TwitterifyOptions): boolean {
  const configured =
    options.usemarkdown === true ||
    options.usemarkdown === 1 ||
    options.usemarkdown === "1";
  return popclip.modifiers.option ? !configured : configured;
}

function twitterify(text: string, markdown: boolean): string {
  return text.replace(/(\s|^)([@#]\w+)/g, (_full, lead: string, match: string) => {
    if (match.startsWith("@")) {
      const user = match.slice(1);
      return markdown
        ? `${lead}[${match}](https://x.com/${user})`
        : `${lead}<a href="https://x.com/${user}" title="${user} on X">${match}</a>`;
    }

    if (match.startsWith("#")) {
      const tag = match.slice(1);
      const href = `https://x.com/search?q=%23${tag}&src=hash`;
      return markdown
        ? `${lead}[\\${match}](${href})`
        : `${lead}<a href="${href}">${match}</a>`;
    }

    return `${lead}${match}`;
  });
}

return twitterify(
  popclip.input.text,
  useMarkdown(popclip.options as TwitterifyOptions),
);
