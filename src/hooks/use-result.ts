'use client';

import { useEffect, useState } from 'react';
import type z from 'zod/mini';
import type { clientQuizSchema, quizResultsSchema } from '@/lib/validation';

type ClientQuiz = z.infer<typeof clientQuizSchema>;
type QuizResults = z.infer<typeof quizResultsSchema>;

export const useResult = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [quiz, setQuiz] = useState<ClientQuiz | null>(null);

  const getOptionLabel = (
    questionId: string,
    idx: number | null | undefined,
  ) => {
    if (idx === null || idx === undefined) {
      return 'No answer';
    }
    const question = quiz?.questions.find((q) => q.id === questionId);
    return question?.options?.[idx] ?? `Option ${idx + 1}`;
  };

  useEffect(() => {
    try {
      const rawResults = sessionStorage.getItem('quizResults');
      const rawQuiz = sessionStorage.getItem('currentQuiz');

      if (rawResults) {
        setResults(JSON.parse(rawResults));
      }
      if (rawQuiz) {
        setQuiz(JSON.parse(rawQuiz));
      }
    } catch (e) {
      console.error('Failed to load results:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, setIsLoading, results, quiz, getOptionLabel };
};
