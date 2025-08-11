import { z } from 'zod';

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
