'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Loading from '@/components/ui/loading';
import QuestionResultCard from '@/components/ui/question-result-card';
import RadialProgress from '@/components/ui/radial-progress';
import ResultStats from '@/components/ui/result-stats';
import useConfetti from '@/hooks/use-confetti';
import { trpc } from '@/lib/trpc';

const getOptionLabel = (options: string[], idx: number | null | undefined) => {
  if (idx === null || idx === undefined) {
    return 'No answer';
  }

  return options[idx] ?? `Option ${idx + 1}`;
};

export default function ResultPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;

  const { data: result, isLoading } = trpc.quiz.getAttemptById.useQuery(
    { attemptId },
    { enabled: Boolean(attemptId) },
  );

  const { fire: fireConfetti } = useConfetti();

  const formattedCompletionDate = useMemo(() => {
    const date = result ? new Date(result.completedAt) : new Date();

    return date.toLocaleString();
  }, [result]);

  useEffect(() => {
    if (result?.correctAnswers === 5) {
      fireConfetti();
    }
  }, [result, fireConfetti]);

  if (isLoading) {
    return <Loading title="Preparing Results..." description="Please wait" />;
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="mb-4 text-6xl">ℹ️</div>
        <h2 className="mb-2 font-bold text-2xl">No Results Found</h2>
        <p className="mb-6 text-base-content/70">
          Upload a PDF and complete a quiz to see results here.
        </p>
        <Link href="/dashboard/start" className="btn btn-primary">
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
                {result.title || 'Quiz Results'}
              </h1>
              <p className="text-base-content/70">
                Completed at: {formattedCompletionDate}
              </p>
            </div>
            <div className="flex items-center gap-6" aria-live="polite">
              <RadialProgress
                value={result.score}
                size="5.5rem"
                thickness="8px"
              />
              <ResultStats
                correctAnswers={result.correctAnswers}
                totalQuestions={result.totalQuestions}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/dashboard/quiz/${result.quizId}`}
              className="btn btn-outline btn-primary"
            >
              Retake Quiz
            </Link>
            <Link href="/dashboard/start" className="btn btn-primary">
              Generate New Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {result.results.map((item, index) => (
          <QuestionResultCard
            key={item.questionId ?? index}
            isCorrect={item.isCorrect}
            index={index}
            userLabel={getOptionLabel(item.options, item.userAnswer)}
            correctLabel={getOptionLabel(item.options, item.correctAnswer)}
            quizResult={item}
          />
        ))}
      </div>

      <div className="card mb-2 border border-base-content/10 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-base-content/70 text-sm">
              Your results are saved automatically. You can retake the quiz or
              generate a new one by uploading a new PDF.
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/dashboard/quiz/${result.quizId}`}
                className="btn btn-outline btn-primary"
              >
                Retake Quiz
              </Link>
              <Link href="/dashboard/start" className="btn btn-primary">
                Generate New Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
