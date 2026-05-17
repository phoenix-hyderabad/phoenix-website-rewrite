import * as pdfParseModule from 'pdf-parse';

// pdf-parse v2 exports PDFParse as a class constructor
const PDFParse = (pdfParseModule as any).PDFParse || (pdfParseModule as any).default || pdfParseModule;

export interface ParsedPdf {
  text: string;
  pageTexts: string[];
  raw?: any;
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdf> {
  // pdf-parse v2: constructor takes Uint8Array, then .load() then .getText()
  const arr = new Uint8Array(buffer);
  const parser = new PDFParse(arr);
  await parser.load();
  const text: string = await parser.getText();
  // pdf-parse often inserts form-feed (\f) between pages; split on that as a best-effort.
  const pageTexts = text.split(/\f+/).map((p: string) => p.trim()).filter(Boolean);
  return { text, pageTexts };
}

