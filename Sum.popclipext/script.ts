// Total all numbers found in the selection.
// Uses Separator / Decimal Delimiter options for locale-aware parsing and optional output formatting.

type SumOptions = {
  separator?: string;
  delimiter?: string;
  formatoutput?: boolean | string | number;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatOutputNumber(
  value: string,
  decimal: string,
  separator: string,
): string {
  const negative = value.startsWith("-");
  const raw = negative ? value.slice(1) : value;
  const [intPart, fracPart] = raw.split(decimal);
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const signed = (negative ? "-" : "") + grouped;
  return fracPart !== undefined ? `${signed}${decimal}${fracPart}` : signed;
}

function sumText(input: string, options: SumOptions): string {
  const separator = String(options.separator ?? ",");
  const decimal = String(options.delimiter ?? ".");
  const doFormat =
    options.formatoutput === true ||
    options.formatoutput === 1 ||
    options.formatoutput === "1";

  const sep = escapeRegExp(separator);
  const dec = escapeRegExp(decimal);
  const numberPattern = new RegExp(
    `(-?[\\d${sep}]+(${dec}\\d+)?)\\b`,
    "g",
  );

  let total = 0;
  let places = 0;

  for (const match of input.matchAll(numberPattern)) {
    const raw = match[1];
    const fraction = match[2];
    const normalized = raw
      .replace(new RegExp(sep, "g"), "")
      .replace(new RegExp(dec), ".");
    total += parseFloat(normalized);

    if (fraction && fraction.length > places + 1) {
      places = fraction.length - 1;
    }
  }

  // Minimum 2 decimal places when any fractional digit was found as a single place
  if (places === 1) places = 2;

  let out = total.toFixed(places).replace(".", decimal);
  if (doFormat) {
    out = formatOutputNumber(out, decimal, separator);
  }
  return out;
}

return sumText(popclip.input.text, popclip.options as SumOptions);
