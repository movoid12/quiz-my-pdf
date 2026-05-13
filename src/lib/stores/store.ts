import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createQuizSlice, type QuizSlice } from './quiz-slice';
import { createResultsSlice, type ResultsSlice } from './results-slice';

type AppStore = QuizSlice & ResultsSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createQuizSlice(...a),
        ...createResultsSlice(...a),
      }),
      {
        name: 'pdf-quiz-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'pdf-quiz-store' },
  ),
);
