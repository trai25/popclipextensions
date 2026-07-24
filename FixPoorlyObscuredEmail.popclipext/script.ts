// Fix emails obscured like "support AT mydomain DOT com".
// Hold Option to also open a mailto: link for each matched address.

const obscuredEmail =
  /\b(([a-z0-9]+)(\s+DOT\s+([a-z]+?))?\s+AT\s+[a-z0-9]+(\s+DOT\s+[a-z0-9]+)*\s+DOT\s+([a-z]{2,5}))\b/gim;

return popclip.input.text.replace(obscuredEmail, (match) => {
  const address = match
    .replace(/\s+AT\s+/gi, "@")
    .replace(/\s+DOT\s+/gi, ".")
    .replace(/\s+/g, "")
    .trim();

  if (popclip.modifiers.option) {
    popclip.openUrl(`mailto:${address}`);
  }

  return address;
});
