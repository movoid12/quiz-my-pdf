import sanitizeHtml from 'sanitize-html';
import { MIN_TEXT_CHARS } from '@/lib/constants';
import { errorJson, mapErrorToResponse, validatePdfUpload } from '@/lib/utils';
import { generateQuizFromText } from '@/server/ai/generate-quiz';
import { extractTextFromPdf } from '@/server/pdf/extract-text';
import { scanPdfContent } from '@/server/pdf/pdf-scanner';
import { checkRateLimit } from '@/server/pdf/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    // Rate limit check (IP-based)
    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      return errorJson('Too many requests', 429, {
        'Retry-After': String(rateLimit.retryAfter ?? 60),
      });
    }

    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return errorJson(
        "Unsupported Media Type. Expecting multipart/form-data with 'pdf' file.",
        415,
      );
    }

    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!(file instanceof File)) {
      return errorJson('No PDF file provided', 400);
    }

    // Strict validation of the uploaded file (size + magic number)
    await validatePdfUpload(file);

    // Security scan for malicious content
    const buffer = Buffer.from(await file.arrayBuffer());

    await scanPdfContent(buffer);

    let text = await extractTextFromPdf(file);

    text = sanitizeHtml(text);

    if (text.length < MIN_TEXT_CHARS) {
      return errorJson('Insufficient content in PDF', 400);
    }

    const level = formData.get('level') as string;

    const quiz = await generateQuizFromText(text, level);

    return Response.json(quiz);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('Error processing PDF:', error);
    return mapErrorToResponse(message);
  }
}
