import z from 'zod';
import { quizCategoryEnum, quizDifficultyEnum } from '@/db/schema';

export type ClientQuiz = z.infer<typeof clientQuizSchema>;

export type QuizResults = z.infer<typeof quizResultsSchema>;

// Full server-side schema — includes correctAnswer, used for AI output and DB storage
// ai-quiz-generation.AI.1 — conforms to this schema
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
  category: z.enum(quizCategoryEnum.enumValues),
  questions: z
    .array(questionSchema)
    .length(5, 'Exactly 5 questions are required'),
});

// Client-safe schema — no correctAnswer exposed to the browser
// ai-quiz-generation.PERSIST.3
export const clientQuestionSchema = z.object({
  id: z.uuid(),
  question: z.string(),
  type: z.literal('multiple-choice'),
  options: z.array(z.string()),
  order: z.number(),
});

export const clientQuizSchema = z.object({
  quizId: z.uuid(),
  title: z.string(),
  category: z.enum(quizCategoryEnum.enumValues),
  difficulty: z.enum(quizDifficultyEnum.enumValues),
  questions: z.array(clientQuestionSchema),
});

export const quizResultSchema = z.object({
  questionId: z.string(),
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
