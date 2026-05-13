'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppStore } from '@/lib/stores/store';
import { trpc } from '@/lib/trpc';

export const useQuiz = () => {
  const router = useRouter();

  const setQuizResults = useAppStore((s) => s.setQuizResults);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const saveAttempt = trpc.quiz.saveAttempt.useMutation({
    onSuccess: (result) => {
      const quiz = useAppStore.getState().currentQuiz;
      if (!quiz) {
        return;
      }

      const quizResults = {
        title: quiz.title,
        score: result.score,
        totalQuestions: result.total,
        correctAnswers: result.correct,
        completedAt: new Date().toISOString(),
        results: result.answers.map((a) => {
          const question = quiz.questions.find((q) => q.id === a.questionId);
          return {
            questionId: a.questionId,
            question: question?.question ?? '',
            userAnswer: a.selectedOption,
            correctAnswer: a.correctAnswer,
            isCorrect: a.isCorrect,
            type: question?.type ?? 'multiple-choice',
          };
        }),
      };

      setQuizResults(quizResults);
      router.push('/dashboard/result');
    },
  });

  const handleSubmit = () => {
    const quiz = useAppStore.getState().currentQuiz;
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
