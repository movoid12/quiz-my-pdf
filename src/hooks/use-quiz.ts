'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type z from 'zod/mini';
import type { questionsSchema } from '@/lib/quiz-schema';

type GeneratedQuiz = z.infer<typeof questionsSchema>;

export const useQuiz = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(
    null,
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleSubmit = () => {
    setIsSubmitting(true);

    let score = 0;

    const results = generatedQuiz?.questions.map((question) => {
      const userAnswer = answers[question.id];

      let isCorrect = false;

      if (question.type === 'multiple-choice') {
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) { score++; }

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        type: question.type,
      };
    });

    const quizResults = {
      title: generatedQuiz?.title,
      score: generatedQuiz
        ? Math.round((score / generatedQuiz.questions.length) * 100)
        : 0,
      totalQuestions: generatedQuiz?.questions.length || 0,
      correctAnswers: score,
      results,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem('quizResults', JSON.stringify(quizResults));

    // Simulate processing time
    setTimeout(() => {
      router.push('/result');
    }, 1500);
  };

  useEffect(() => {
    try {
      const quizData = sessionStorage.getItem('currentQuiz');
      if (quizData) {
        const parsedQuiz = JSON.parse(quizData);
        if (
          parsedQuiz?.questions &&
          parsedQuiz.questions.length > 0
        ) {
          setGeneratedQuiz(parsedQuiz);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    isSubmitting,
    isLoading,
    answers,
    setAnswers,
    generatedQuiz,
    handleSubmit,
    currentQuestion,
    setCurrentQuestion,
  };
};
