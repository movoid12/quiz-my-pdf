'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type z from 'zod';
import { trpc } from '@/lib/trpc';
import type { clientQuizSchema } from '@/lib/validation';

type ClientQuiz = z.infer<typeof clientQuizSchema>;

export const useQuiz = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [generatedQuiz, setGeneratedQuiz] = useState<ClientQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const saveAttempt = trpc.quiz.saveAttempt.useMutation({
    onSuccess: (result) => {
      const quiz = generatedQuiz;
      if (!quiz) { return; }

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

      sessionStorage.setItem('quizResults', JSON.stringify(quizResults));
      router.push('/dashboard/result');
    },
  });

  const handleSubmit = () => {
    if (!generatedQuiz) { return; }

    saveAttempt.mutate({
      quizId: generatedQuiz.quizId,
      answers: generatedQuiz.questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] ?? -1,
      })),
    });
  };

  useEffect(() => {
    try {
      const quizData = sessionStorage.getItem('currentQuiz');
      if (quizData) {
        const parsedQuiz = JSON.parse(quizData) as ClientQuiz;
        if (parsedQuiz?.questions && parsedQuiz.questions.length > 0) {
          setGeneratedQuiz(parsedQuiz);
        } else {
          router.push('/dashboard/start');
        }
      } else {
        router.push('/dashboard/start');
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
      router.push('/dashboard/start');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    isSubmitting: saveAttempt.isPending,
    isLoading,
    answers,
    setAnswers,
    generatedQuiz,
    handleSubmit,
    currentQuestion,
    setCurrentQuestion,
  };
};
