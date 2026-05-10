import { createRequire } from 'node:module';
import { MAX_FILE_SIZE, MAX_TEXT_CHARS } from '@/lib/constants';
import { isLikelyPdf, normalizeText } from '@/lib/utils';

const require = createRequire(import.meta.url);

function loadPdfParse(): (buffer: Buffer) => Promise<{ text: string }> {
  return require('pdf-parse');
}

export async function extractTextFromPdf(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 10MB)');
  }

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  if (!isLikelyPdf(buffer)) {
    throw new Error('Invalid file format. Please upload a PDF.');
  }

  try {
    const pdfParse = loadPdfParse();
    const parsed = await pdfParse(buffer);
    return normalizeText(parsed.text || '', MAX_TEXT_CHARS);
  } catch {
    throw new Error('Failed to read PDF content');
  }
}
