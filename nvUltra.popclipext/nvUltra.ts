// Create a note in nvUltra from the selection.
// Optional Folder setting targets a specific notebook; otherwise the frontmost one is used.

const text = encodeURIComponent(popclip.input.text);
const notebookName = String(popclip.options.nvnotebook ?? "").trim();
const notebook = notebookName
  ? `&notebook="${encodeURIComponent(notebookName)}"`
  : "";

popclip.openUrl(`x-nvultra://make/?txt=${text}${notebook}`);
