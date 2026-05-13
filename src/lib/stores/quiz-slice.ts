import type z from 'zod';
import type { StateCreator } from 'zustand';
import type { clientQuizSchema } from '@/lib/validation';

export type ClientQuiz = z.infer<typeof clientQuizSchema>;

export interface QuizSlice {
  currentQuiz: ClientQuiz | null;
  setCurrentQuiz: (quiz: ClientQuiz) => void;
  clearCurrentQuiz: () => void;
}

export const createQuizSlice: StateCreator<QuizSlice> = (set) => ({
  currentQuiz: null,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  clearCurrentQuiz: () => set({ currentQuiz: null }),
});
