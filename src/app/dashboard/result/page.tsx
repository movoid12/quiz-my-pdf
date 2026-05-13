'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import QuestionResultCard from '@/components/ui/question-result-card';
import RadialProgress from '@/components/ui/radial-progress';
import ResultStats from '@/components/ui/result-stats';
import useConfetti from '@/hooks/use-confetti';
import { menuItems } from '@/lib/constants';
import { useAppStore } from '@/lib/stores/store';

const getOptionLabel = (
  quiz: { questions: { id: string; options: string[] }[] } | null,
  questionId: string,
  idx: number | null | undefined,
) => {
  if (idx === null || idx === undefined) {
    return 'No answer';
  }
  const question = quiz?.questions.find((q) => q.id === questionId);
  return question?.options?.[idx] ?? `Option ${idx + 1}`;
};

export default function ResultPage() {
  const clearQuizResults = useAppStore((s) => s.clearQuizResults);
  const clearCurrentQuiz = useAppStore((s) => s.clearCurrentQuiz);
  const results = useAppStore((s) => s.quizResults);
  const quiz = useAppStore((s) => s.currentQuiz);

  const formattedCompletionDate = useMemo(() => {
    const date = results ? new Date(results.completedAt) : new Date();
    return date.toLocaleString();
  }, [results?.completedAt, results]);

  const handleNewQuiz = () => {
    clearQuizResults();
    clearCurrentQuiz();
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

  if (!results) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="mb-4 text-6xl">ℹ️</div>
        <h2 className="mb-2 font-bold text-2xl">No Results Found</h2>
        <p className="mb-6 text-base-content/70">
          Upload a PDF and complete a quiz to see results here.
        </p>
        <Link
          href={menuItems[1].href}
          className="btn btn-primary"
          onClick={handleNewQuiz}
        >
          Back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-6">
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
            <Link
              href={menuItems[3].href}
              className="btn btn-outline btn-primary"
            >
              Retake Quiz
            </Link>
            <Link
              href={menuItems[1].href}
              className="btn btn-primary"
              onClick={handleNewQuiz}
            >
              Generate New Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {results.results.map((r, idx) => {
          const isCorrect = r.isCorrect;
          const userLabel = getOptionLabel(quiz, r.questionId, r.userAnswer);
          const correctLabel = getOptionLabel(quiz, r.questionId, r.correctAnswer);

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

      <div className="card bg-base-100 border border-base-content/10 shadow-sm mb-2">
        <div className="card-body">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-base-content/70 text-sm">
              Your results are saved automatically. You can retake the quiz or
              generate a new one by uploading a new PDF.
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={menuItems[3].href}
                className="btn btn-outline btn-primary"
              >
                Retake Quiz
              </Link>
              <Link
                href={menuItems[1].href}
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
