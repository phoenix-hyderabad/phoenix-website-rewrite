import * as pdfParseModule from 'pdf-parse';

// Handle CommonJS/ESM interop for pdf-parse
const parsePdf = (pdfParseModule as any).PDFParse || (pdfParseModule as any).default || pdfParseModule;

export interface ParsedPdf {
  text: string;
  pageTexts: string[];
  raw?: any;
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdf> {
  const data = await parsePdf(buffer as any);
  const text = data && data.text ? String(data.text) : '';
  // pdf-parse often inserts form-feed (\f) between pages; split on that as a best-effort.
  const pageTexts = text.split(/\f+/).map((p: string) => p.trim()).filter(Boolean);
  return { text, pageTexts, raw: data };
}
