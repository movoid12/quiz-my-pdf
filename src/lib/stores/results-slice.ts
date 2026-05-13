import type z from 'zod';
import type { StateCreator } from 'zustand';
import type { quizResultsSchema } from '@/lib/validation';

export type QuizResults = z.infer<typeof quizResultsSchema>;

export interface ResultsSlice {
  quizResults: QuizResults | null;
  setQuizResults: (results: QuizResults) => void;
  clearQuizResults: () => void;
}

export const createResultsSlice: StateCreator<ResultsSlice> = (set) => ({
  quizResults: null,
  setQuizResults: (results) => set({ quizResults: results }),
  clearQuizResults: () => set({ quizResults: null }),
});
