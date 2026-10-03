import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/**
 * Extracts the text layer of a PDF entirely in the browser. pdf.js is loaded
 * lazily so it stays in its own chunk.
 */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;

  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(pageText);
  }

  const text = pages
    .join('\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  if (!text) {
    throw new Error(
      `"${file.name}" has no extractable text layer (likely a scanned image). Try an OCR'd PDF or paste the text directly.`,
    );
  }
  return text;
}

/** Extracts raw text from a .docx file using mammoth (lazily loaded). */
export async function extractDocxText(file: File): Promise<string> {
  const mammothModule = await import('mammoth');
  const mammoth = mammothModule.default ?? mammothModule;

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();

  if (!text) throw new Error(`"${file.name}" contains no extractable text.`);
  return text;
}
