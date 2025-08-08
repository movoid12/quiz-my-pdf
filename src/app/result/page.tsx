"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import z from "zod";
// components & hooks
import { questionsSchema } from "@/lib/quiz-schema";
import { quizResultsSchema } from "@/lib/quiz-result-schema";
import RadialProgress from "../_components/ui/radial-progress";
import ResultStats from "../_components/ui/result-stats";
import QuestionResultCard from "../_components/ui/question-result-card";

type GeneratedQuiz = z.infer<typeof questionsSchema>;

type QuizResults = z.infer<typeof quizResultsSchema>;

export default function ResultPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);

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

  const formattedCompletionDate = useMemo(() => {
    if (!results?.completedAt) return "";

    const date = new Date(results.completedAt);

    return date.toLocaleString();
  }, [results?.completedAt]);

  const getOptionLabel = (
    questionId: number,
    idx: number | null | undefined
  ) => {
    if (idx === null || idx === undefined) return "No answer";
    const q = quiz?.questions.find((q) => q.id === questionId);
    return q?.options?.[idx] ?? `Option ${idx + 1}`;
  };

  const handleNewQuiz = () => {
    sessionStorage.removeItem("quizResults");
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <h2 className="text-2xl font-bold mb-2">Preparing Results...</h2>
        <p className="text-base-content/70">Please wait</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">ℹ️</div>
        <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
        <p className="text-base-content/70 mb-6">
          Upload a PDF and complete a quiz to see results here.
        </p>
        <Link href="/start" className="btn btn-primary" onClick={handleNewQuiz}>
          Back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-6 space-y-6">
      {/* Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="card-title text-2xl">
                {results.title || "Quiz Results"}
              </h1>
              <p className="text-base-content/70">
                Completed at: {formattedCompletionDate}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <RadialProgress
                value={results.score}
                size="5.5rem"
                thickness="8px"
              />
              <ResultStats
                correctAnswers={results.correctAnswers}
                totalQuestions={results.totalQuestions}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/quiz" className="btn btn-outline btn-primary">
              Retake Quiz
            </Link>
            <Link href="/" className="btn btn-primary" onClick={handleNewQuiz}>
              Generate New Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-4">
        {results.results.map((r, idx) => {
          const isCorrect = r.isCorrect;
          const userLabel = getOptionLabel(r.questionId, r.userAnswer);
          const correctLabel = getOptionLabel(r.questionId, r.correctAnswer);

          return (
            <QuestionResultCard
              key={r.questionId ?? idx}
              isCorrect={isCorrect}
              index={idx}
              userLabel={userLabel}
              correctLabel={correctLabel}
              quizResult={r}
            />
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-base-content/70">
              Your results are saved automatically. You can{" "}
              <Link href="/results" className="link">
                view past results
              </Link>{" "}
              or share your score with others!
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/quiz" className="btn btn-outline btn-primary">
                Retake Quiz
              </Link>
              <Link
                href="/"
                className="btn btn-primary"
                onClick={handleNewQuiz}
              >
                Generate New Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
