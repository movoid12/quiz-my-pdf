'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToastStore } from '@/lib/stores/toast-store';
import { trpc } from '@/lib/trpc';
import type { ClientQuiz } from '@/lib/validation';

export const useQuiz = (quiz: ClientQuiz | null) => {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const saveAttempt = trpc.quiz.saveAttempt.useMutation({
    onSuccess: (result) => {
      addToast('success', 'Quiz submitted!');
      router.push(`/dashboard/result/${result.attemptId}`);
    },
    onError: (_error) => {
      addToast('error', 'Failed to submit quiz');
    },
  });

  const handleSubmit = () => {
    if (!quiz) {
      return;
    }

    saveAttempt.mutate({
      quizId: quiz.quizId,
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] ?? -1,
      })),
    });
  };

  return {
    isSubmitting: saveAttempt.isPending,
    answers,
    setAnswers,
    handleSubmit,
    currentQuestion,
    setCurrentQuestion,
  };
};
