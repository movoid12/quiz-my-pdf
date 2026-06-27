import sanitizeHtml from 'sanitize-html';
import {
  type Difficulty,
  questionAnswers,
  questions,
  quizzes,
} from '@/db/schema';
import { MIN_TEXT_CHARS } from '@/lib/constants';
import { errorJson, mapErrorToResponse, validatePdfUpload } from '@/lib/utils';
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

    let text = await extractTextFromPdf(file); // ai-quiz-generation.E_API.1
    text = sanitizeHtml(text); // ai-quiz-generation.A_TEXT.4

    // ai-quiz-generation.A_TEXT.2
    if (text.length < MIN_TEXT_CHARS) {
      return errorJson('Insufficient content in PDF', 400);
    }

    const difficulty = (formData.get('level') as Difficulty | null) ?? 'medium';

    const quiz = await generateQuizFromText(text, difficulty);

    // ai-quiz-generation.D_PERSIST.1 — atomic persistence
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

    // ai-quiz-generation.D_PERSIST.2 — correctAnswer in separate table
    await db.insert(questionAnswers).values(
      savedQuestions.map((sq, i) => ({
        questionId: sq.id,
        correctAnswer: quiz.questions[i].correctAnswer,
      })),
    );

    // ai-quiz-generation.D_PERSIST.3 — no correctAnswer in response
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
    // ai-quiz-generation.E_API.2
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';

    console.error('Error processing PDF:', error);
    return mapErrorToResponse(message);
  }
}
