// Direct pdfjs-dist usage — runs as external package (not bundled by Turbopack)
// See next.config.js: serverExternalPackages includes "pdfjs-dist"

export interface ParsedPdf {
  text: string;
  pageTexts: string[];
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdf> {
  // Dynamic import so it resolves at runtime from node_modules (not bundled)
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Disable worker — run PDF.js inline on the server thread
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";
  }

  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  const doc = await loadingTask.promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item: any) => item.str !== undefined)
      .map((item: any) => item.str as string);
    pageTexts.push(strings.join(" "));
  }

  const text = pageTexts.join("\n\n");
  return { text, pageTexts };
}
