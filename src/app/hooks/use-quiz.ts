"use client";

import { quizResultsSchema } from "@/lib/quiz-result-schema";
import { questionsSchema } from "@/lib/quiz-schema";
import { useState, useEffect } from "react";
import z from "zod/mini";

type GeneratedQuiz = z.infer<typeof questionsSchema>;

type QuizResults = z.infer<typeof quizResultsSchema>;

export const useQuiz = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);

  const getOptionLabel = (
    questionId: number,
    idx: number | null | undefined
  ) => {
    if (idx === null || idx === undefined) return "No answer";
    const q = quiz?.questions.find((q) => q.id === questionId);
    return q?.options?.[idx] ?? `Option ${idx + 1}`;
  };

  useEffect(() => {
    try {
      const rawResults = sessionStorage.getItem("quizResults");
      const rawQuiz = sessionStorage.getItem("currentQuiz");

      if (rawResults) setResults(JSON.parse(rawResults));
      if (rawQuiz) setQuiz(JSON.parse(rawQuiz));
    } catch (e) {
      console.error("Failed to load results:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, setIsLoading, results, quiz, getOptionLabel };
};
