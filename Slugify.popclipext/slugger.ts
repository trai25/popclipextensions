// Turn selected text into a URL/post slug.
// Preserves readable tokens for ".", "+", "&", and "@"; strips diacritics.

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining marks (é → e)
    .toLowerCase()
    .replace(/\./g, "-dot-")
    .replace(/\+/g, "-plus-")
    .replace(/&/g, "-and-")
    .replace(/@/g, "-at-")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9\s-]+/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

return slugify(popclip.input.text);
