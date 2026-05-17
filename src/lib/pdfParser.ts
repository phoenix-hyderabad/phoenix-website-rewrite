// pdf-parse v1 (debugging disabled fork) — bundles its own pdfjs, no workers, no external deps, just works
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse-debugging-disabled");

export interface ParsedPdf {
  text: string;
  pageTexts: string[];
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdf> {
  const data = await pdf(buffer);
  const text: string = data.text || "";
  const pageTexts = text
    .split(/\f+/)
    .map((p: string) => p.trim())
    .filter(Boolean);
  return { text, pageTexts };
}
