import { create } from 'zustand';

export const HISTORY_PAGE_SIZE = 10;

export type DeleteTarget = {
  quizId: string;
  title: string;
};

type HistoryStore = {
  offset: number;
  retakingQuizId: string | null;
  deletingId: string | null;
  nextPage: () => void;
  prevPage: () => void;
  setRetakingQuizId: (quizId: string | null) => void;
  setDeletingId: (quizId: string | null) => void;
};

export const useHistoryStore = create<HistoryStore>((set) => ({
  offset: 0,
  retakingQuizId: null,
  deletingId: null,
  nextPage: () =>
    set((state) => ({ offset: state.offset + HISTORY_PAGE_SIZE })),
  prevPage: () =>
    set((state) => ({
      offset: Math.max(0, state.offset - HISTORY_PAGE_SIZE),
    })),
  setRetakingQuizId: (quizId) => set({ retakingQuizId: quizId }),
  setDeletingId: (quizId) => set({ deletingId: quizId }),
}));
