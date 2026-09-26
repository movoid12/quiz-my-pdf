'use client';

import type { inferRouterOutputs } from '@trpc/server';
import { RotateCcw, Trash2 } from 'lucide-react';
import { formatFullDate, formatRelativeTime } from '@/lib/utils';
import type { AppRouter } from '@/server/routers';

export type HistoryAttempt =
  inferRouterOutputs<AppRouter>['quiz']['history'][number];

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'badge-success',
  medium: 'badge-warning',
  hard: 'badge-error',
};

const scoreBadge = (score: number) => {
  if (score >= 80) {
    return 'badge-success';
  }
  if (score >= 60) {
    return 'badge-warning';
  }
  return 'badge-error';
};

export default function AttemptCard({
  attempt,
  isRetaking,
  isDeleting,
  onRetake,
  onDelete,
}: {
  attempt: HistoryAttempt;
  isRetaking: boolean;
  isDeleting: boolean;
  onRetake: (quizId: string) => void;
  onDelete: (quizId: string, title: string) => void;
}) {
  return (
    <div className="card border border-base-content/10 bg-base-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="card-body gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-semibold text-base">
              {attempt.title}
            </h2>
            <div
              className="tooltip tooltip-bottom"
              data-tip={formatFullDate(attempt.completedAt)}
            >
              <p className="mt-0.5 text-base-content/50 text-xs">
                {formatRelativeTime(attempt.completedAt)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`badge badge-soft font-bold ${scoreBadge(attempt.score)}`}
            >
              {attempt.score}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-soft badge-primary capitalize">
              {attempt.category}
            </span>
            <span
              className={`badge badge-soft capitalize ${DIFFICULTY_BADGE[attempt.difficulty] ?? ''}`}
            >
              {attempt.difficulty}
            </span>
            <span className="badge badge-soft">
              {attempt.correctAnswers}/{attempt.totalQuestions} correct
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-outline btn-primary btn-sm gap-1"
              onClick={() => onRetake(attempt.quizId)}
              disabled={isRetaking}
            >
              {isRetaking ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              Retake
            </button>
            <button
              type="button"
              className="btn btn-outline btn-error btn-sm gap-1"
              onClick={() => onDelete(attempt.quizId, attempt.title)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
