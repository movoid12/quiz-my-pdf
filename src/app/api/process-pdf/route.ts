import sanitizeHtml from 'sanitize-html';
import { MIN_TEXT_CHARS } from '@/lib/constants';
import { generateQuizFromText } from '@/server/ai/generate-quiz';
import { extractTextFromPdf } from '@/server/pdf/extract-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return Response.json(
        {
          error:
            "Unsupported Media Type. Expecting multipart/form-data with 'pdf' file.",
        },
        { status: 415 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!(file instanceof File)) {
      return Response.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    let text = await extractTextFromPdf(file);

    text = sanitizeHtml(text);

    if (text.length < MIN_TEXT_CHARS) {
      return Response.json(
        { error: 'Insufficient content in PDF' },
        { status: 400 },
      );
    }

    const level = formData.get('level') as string;

    const quiz = await generateQuizFromText(text, level);

    return Response.json(quiz);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('Error processing PDF:', error);

    if (message.includes('multipart/form-data')) {
      return Response.json({ error: message }, { status: 415 });
    }
    if (message.includes('File too large')) {
      return Response.json({ error: message }, { status: 400 });
    }
    if (message.includes('Invalid file format')) {
      return Response.json({ error: message }, { status: 415 });
    }
    if (message.includes('Failed to read PDF content')) {
      return Response.json({ error: message }, { status: 400 });
    }
    if (message.includes('AI returned invalid data format')) {
      return Response.json({ error: message }, { status: 502 });
    }
    if (message.includes('The user aborted a request')) {
      return Response.json(
        { error: 'Client aborted request' },
        { status: 499 },
      );
    }

    return Response.json(
      { error: 'Upstream AI error or invalid response' },
      { status: 502 },
    );
  }
}
