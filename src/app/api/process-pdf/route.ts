import sanitizeHtml from 'sanitize-html';
import { questionAnswers, questions, quizzes } from '@/db/schema';
import { MIN_TEXT_CHARS } from '@/lib/constants';
import { errorJson, mapErrorToResponse, validatePdfUpload } from '@/lib/utils';
import { QUIZ_DIFFICULTIES } from '@/lib/validation';
import { generateQuizFromText } from '@/server/ai/generate-quiz';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { extractTextFromPdf } from '@/server/pdf/extract-text';
import { scanPdfContent } from '@/server/pdf/pdf-scanner';
import { checkRateLimit } from '@/server/pdf/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      return errorJson('Too many requests', 429, {
        'Retry-After': String(rateLimit.retryAfter ?? 60),
      });
    }

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return errorJson('Unauthorized', 401);
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

    await validatePdfUpload(file);

    const buffer = Buffer.from(await file.arrayBuffer());
    await scanPdfContent(buffer);

    let text = await extractTextFromPdf(file);
    text = sanitizeHtml(text);

    if (text.length < MIN_TEXT_CHARS) {
      return errorJson('Insufficient content in PDF', 400);
    }

    const rawLevel = (formData.get('level') as string | null) ?? 'medium';
    const difficulty = (
      QUIZ_DIFFICULTIES.includes(rawLevel as (typeof QUIZ_DIFFICULTIES)[number])
        ? rawLevel
        : 'medium'
    ) as (typeof QUIZ_DIFFICULTIES)[number];

    const quiz = await generateQuizFromText(text, difficulty);

    // Persist quiz — correct answers go to a separate table, never returned to client
    const [savedQuiz] = await db
      .insert(quizzes)
      .values({
        userId: session.user.id,
        title: quiz.title,
        category: quiz.category,
        difficulty,
      })
      .returning();

    const savedQuestions = await db
      .insert(questions)
      .values(
        quiz.questions.map((q, i) => ({
          quizId: savedQuiz.id,
          question: q.question,
          options: q.options,
          displayOrder: i,
          type: q.type,
        })),
      )
      .returning();

    await db.insert(questionAnswers).values(
      savedQuestions.map((sq, i) => ({
        questionId: sq.id,
        correctAnswer: quiz.questions[i].correctAnswer,
      })),
    );

    // Return client-safe shape — no correctAnswer
    return Response.json({
      quizId: savedQuiz.id,
      title: savedQuiz.title,
      category: savedQuiz.category,
      difficulty: savedQuiz.difficulty,
      questions: savedQuestions.map((sq, i) => ({
        id: sq.id,
        question: sq.question,
        type: sq.type,
        options: sq.options,
        order: i,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('Error processing PDF:', error);
    return mapErrorToResponse(message);
  }
}
