'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import Loading from '@/components/ui/loading';
import QuestionResultCard from '@/components/ui/question-result-card';
import RadialProgress from '@/components/ui/radial-progress';
// components & hooks
import ResultStats from '@/components/ui/result-stats';
import useConfetti from '@/hooks/use-confetti';
import { useResult } from '@/hooks/use-result';

export default function ResultPage() {
  const { isLoading, results, getOptionLabel } = useResult();

  const formattedCompletionDate = useMemo(() => {
    const date = results ? new Date(results.completedAt) : new Date();

    return date.toLocaleString();
  }, [results?.completedAt, results]);

  const handleNewQuiz = () => {
    sessionStorage.removeItem('quizResults');
  };

  const { fire: fireConfetti } = useConfetti();

  useEffect(() => {
    if (!results) {
      return;
    }

    if (results.correctAnswers === 5) {
      fireConfetti();
    }
  }, [results, fireConfetti]);

  if (isLoading) {
    return <Loading title="Preparing Results..." description="Please wait" />;
  }

  if (!results) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="mb-4 text-6xl">ℹ️</div>
        <h2 className="mb-2 font-bold text-2xl">No Results Found</h2>
        <p className="mb-6 text-base-content/70">
          Upload a PDF and complete a quiz to see results here.
        </p>
        <Link href="/start" className="btn btn-primary" onClick={handleNewQuiz}>
          Back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-6">
      {/* Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="card-title text-2xl">
                {results.title || 'Quiz Results'}
              </h1>
              <p className="text-base-content/70">
                Completed at: {formattedCompletionDate}
              </p>
            </div>
            <div className="flex items-center gap-6" aria-live="polite">
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-base-content/70 text-sm">
              Your results are saved automatically. You can{' '}
              <Link href="/results" className="link">
                view past results
              </Link>{' '}
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
