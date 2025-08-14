import z from 'zod';

export const questionSchema = z.object({
  id: z.number().int().nonnegative(),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  type: z.literal('multiple-choice'),
  options: z
    .array(z.string().min(1))
    .length(4, 'Exactly 4 options are required'),
  correctAnswer: z.number().int().min(0).max(3),
});

export const questionsSchema = z.object({
  title: z.string().min(1).max(200),
  questions: z
    .array(questionSchema)
    .length(5, 'Exactly 5 questions are required'),
});

export const quizResultSchema = z.object({
  questionId: z.number(),
  question: z.string(),
  userAnswer: z.number().nullable().optional(),
  correctAnswer: z.number(),
  isCorrect: z.boolean(),
  type: z.string(),
});

export const quizResultsSchema = z.object({
  title: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  completedAt: z.string(),
  results: z.array(quizResultSchema),
});
