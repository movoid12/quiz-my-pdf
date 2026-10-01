'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { routes } from '@/lib/routes';
import { useToastStore } from '@/lib/stores/toast-store';
import { trpc } from '@/lib/trpc';
import type { ClientQuiz } from '@/lib/validation';

export const useQuiz = (quiz: ClientQuiz | null) => {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const submitted = useRef(false);

  const saveAttempt = trpc.quiz.saveAttempt.useMutation({
    onSuccess: (result) => {
      addToast('success', 'Quiz submitted!');
      router.push(routes.dashboard.result(result.attemptId));
    },
    onError: (_error) => {
      submitted.current = false;
      addToast('error', 'Failed to submit quiz');
    },
  });

  const handleSubmit = useCallback(() => {
    if (!quiz || submitted.current) {
      return;
    }

    submitted.current = true;
    saveAttempt.mutate({
      quizId: quiz.quizId,
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] ?? -1,
      })),
    });
  }, [quiz, answers, saveAttempt.mutate]);

  return {
    isSubmitting: saveAttempt.isPending,
    answers,
    setAnswers,
    handleSubmit,
    currentQuestion,
    setCurrentQuestion,
  };
};
