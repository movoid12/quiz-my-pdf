'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import type { ClientQuiz } from '@/lib/validation';

export const useQuiz = (quiz: ClientQuiz | null) => {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const saveAttempt = trpc.quiz.saveAttempt.useMutation({
    onSuccess: (result) => {
      router.push(`/dashboard/result/${result.attemptId}`);
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
