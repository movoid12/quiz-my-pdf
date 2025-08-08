"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import z from "zod";
import { questionsSchema } from "@/lib/quiz-schema";

type GeneratedQuiz = z.infer<typeof questionsSchema>;

type QuizResults = {
  title: string;
  score: number; // percentage 0..100
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string; // ISO
  results: Array<{
    questionId: number;
    question: string;
    userAnswer: number | null | undefined;
    correctAnswer: number;
    isCorrect: boolean;
    type: string;
  }>;
};

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

  const prettyDate = useMemo(() => {
    if (!results?.completedAt) return "";
    const d = new Date(results.completedAt);
    return d.toLocaleString();
  }, [results?.completedAt]);

  const getOptionLabel = (questionId: number, idx: number | null | undefined) => {
    if (idx === null || idx === undefined) return "No answer";
    const q = quiz?.questions.find((q) => q.id === questionId);
    return q?.options?.[idx] ?? `Option ${idx + 1}`;
  };

  const handleNewQuiz = () => {
    // Keep currentQuiz if you want to allow immediate retake with same questions
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
        <Link href="/" className="btn btn-primary" onClick={handleNewQuiz}>
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
              <h1 className="card-title text-2xl">{results.title || "Quiz Results"}</h1>
              <p className="text-base-content/70">Completed: {prettyDate}</p>
            </div>
            <div className="flex items-center gap-6">
              <div
                className="radial-progress text-primary"
                style={
                  {
                    "--value": results.score,
                    "--size": "5.5rem",
                    "--thickness": "8px",
                  } as React.CSSProperties
                }
                role="progressbar"
                aria-valuenow={results.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Score"
                title={`${results.score}%`}
              >
                <span className="text-lg font-semibold">{results.score}%</span>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Correct</div>
                  <div className="stat-value text-success">{results.correctAnswers}</div>
                  <div className="stat-desc">of {results.totalQuestions}</div>
                </div>
              </div>
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
            <div
              key={r.questionId ?? idx}
              className={`card bg-base-100 shadow ${
                isCorrect ? "border border-success" : "border border-error"
              }`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="badge badge-primary mb-2">Question {idx + 1}</div>
                    <h3 className="card-title text-base md:text-lg">{r.question}</h3>
                  </div>
                  <div className={`badge ${isCorrect ? "badge-success" : "badge-error"}`}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </div>
                </div>

                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-base-200">
                    <div className="text-sm text-base-content/70 mb-1">Your answer</div>
                    <div className="font-medium">
                      {userLabel}
                      {typeof r.userAnswer === "number" && (
                        <span className="text-base-content/60"> (#{r.userAnswer + 1})</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-base-200">
                    <div className="text-sm text-base-content/70 mb-1">Correct answer</div>
                    <div className="font-medium">
                      {correctLabel}
                      <span className="text-base-content/60"> (#{r.correctAnswer + 1})</span>
                    </div>
                  </div>
                </div>

                {!isCorrect && typeof r.userAnswer !== "number" && (
                  <div className="alert mt-3">
                    <span>No answer selected for this question.</span>
                  </div>
                )}
              </div>
            </div>
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
              <Link href="/" className="btn btn-primary" onClick={handleNewQuiz}>
                Generate New Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}