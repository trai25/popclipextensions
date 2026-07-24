// Repeat text by expanding ##START..END## or ##a,b,c## templates.
// Supports ##x## / ##i## math placeholders and ##expr#opt1,opt2## lists.

const NUMERIC_RX = /(\?\:)?##(\d+)(?:\.\.(\d+))?\.\.(\d+)##/;
const ARRAY_RX = /##(.*?)##/;
const MODIFIER_RX = /##(([ix0-9()+\-/*%]+)*)(#([^#]+))?##/g;

type Modifier = {
  raw: string;
  padding: string;
  base: string;
  optionsArray: string[] | null;
};

function sprintfPad(format: string, n: number): string {
  const value = Math.trunc(Number(n));
  const match = /^%0(\d+)d$/.exec(format);
  if (match) {
    const width = parseInt(match[1], 10);
    const sign = value < 0 ? "-" : "";
    return sign + String(Math.abs(value)).padStart(width, "0");
  }
  return String(value);
}

function evalEquat(equat: string): number {
  const cleaned = equat.trim();
  if (cleaned === "") return 0;
  if (!/^[0-9()+\-*/%\s]+$/.test(cleaned)) {
    throw new Error(`Invalid equation: ${equat}`);
  }
  return Function(`"use strict"; return (${cleaned});`)() as number;
}

function paddingFor(expr: string | undefined): string {
  if (expr == null || expr === "") return "%d";
  const t = expr.match(/\b(0+)([1-9]\d*)?/);
  if (t == null || /^0$/.test(expr)) return "%d";
  return `%0${t[0].length}d`;
}

function replaceFirst(
  haystack: string,
  needle: string,
  replacement: string,
): string {
  const index = haystack.indexOf(needle);
  if (index === -1) return haystack;
  return (
    haystack.slice(0, index) + replacement + haystack.slice(index + needle.length)
  );
}

function getModifiers(input: string): Modifier[] {
  const modifiers: Modifier[] = [];
  for (const match of input.matchAll(MODIFIER_RX)) {
    const raw = match[0];
    const base = match[1] || "x";
    const inner = match[2];
    modifiers.push({
      raw,
      padding: paddingFor(inner),
      base,
      optionsArray: match[3] == null ? null : match[4].split(",").map((s) => s.trim()),
    });
  }
  return modifiers;
}

function applyModifiers(out: string, modifiers: Modifier[], idx: number): string {
  let result = out;
  for (const mod of modifiers) {
    if (!result.includes(mod.raw)) continue;

    const equat = mod.base
      .replace(/\b0+/g, "")
      .replace(/x/g, String(idx + 1))
      .replace(/i/g, String(idx));

    const value = evalEquat(equat);
    if (mod.optionsArray) {
      const index = parseInt(sprintfPad(mod.padding, value), 10);
      result = replaceFirst(result, mod.raw, mod.optionsArray[index] ?? "");
    } else {
      result = replaceFirst(result, mod.raw, sprintfPad(mod.padding, value));
    }
  }
  return result;
}

function processArray(input: string): string {
  const template = input.match(ARRAY_RX);
  if (!template) return input;

  const replacements = template[1].split(",").map((s) => s.trim());
  const modifiers = getModifiers(input);
  const output: string[] = [];

  replacements.forEach((replacement, idx) => {
    let out = replaceFirst(input, template[0], replacement);
    out = out.replace(/##[0x]##/g, replacement);
    out = applyModifiers(out, modifiers, idx);
    output.push(out);
  });

  return output.join("\n");
}

function processNumeric(input: string): string {
  const template = input.match(NUMERIC_RX);
  if (!template) return input;

  const disp = template[1] == null;
  const inc = template[3] == null ? 1 : parseInt(template[3], 10);
  const modifiers = getModifiers(input);
  const padding = paddingFor(template[2]);

  const output: string[] = [];
  let idx = 0;
  let countStart = parseInt(template[2], 10);
  const countEnd = parseInt(template[4], 10);

  while (countStart <= countEnd) {
    const replacement = disp ? sprintfPad(padding, countStart) : "";
    let out = replaceFirst(input, template[0], replacement);
    out = applyModifiers(out, modifiers, idx);
    output.push(out);
    countStart += inc;
    idx += 1;
  }

  return output.join("\n");
}

let input = popclip.input.text;

if (NUMERIC_RX.test(input)) {
  // reset lastIndex from .test
  NUMERIC_RX.lastIndex = 0;
  input = processNumeric(input);
} else if (ARRAY_RX.test(input)) {
  ARRAY_RX.lastIndex = 0;
  input = processArray(input);
}

return input;
