import { PDFParse } from 'pdf-parse';
import { MAX_FILE_SIZE, MAX_TEXT_CHARS } from '@/lib/constants';
import { isLikelyPdf, normalizeText } from '@/lib/utils';

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
    const pdf = new PDFParse({ data: buffer });

    const parsed = await pdf.getText();
    return normalizeText(parsed.text || '', MAX_TEXT_CHARS);
  } catch {
    throw new Error('Failed to read PDF content');
  }
}
