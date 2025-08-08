"use client";

import Link from "next/link";
import { useMemo } from "react";
// components & hooks
import RadialProgress from "../_components/ui/radial-progress";
import ResultStats from "../_components/ui/result-stats";
import QuestionResultCard from "../_components/ui/question-result-card";
import { useResault } from "../hooks/use-resault";

export default function ResultPage() {
  const { isLoading, results, getOptionLabel } = useResault();

  const formattedCompletionDate = useMemo(() => {
    const date = results ? new Date(results.completedAt) : new Date();

    return date.toLocaleString();
  }, [results?.completedAt]);

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
