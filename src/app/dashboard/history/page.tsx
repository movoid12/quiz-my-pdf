"use client";

import { History, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import Loading from "@/components/ui/loading";
import { trpc } from "@/lib/trpc";
import { formatFullDate, formatRelativeTime } from "@/lib/utils";

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: "badge-success",
  medium: "badge-warning",
  hard: "badge-error",
};

const SCORE_BADGE = (score: number) => {
  if (score >= 80) {
    return "badge-success";
  }
  if (score >= 60) {
    return "badge-warning";
  }
  return "badge-error";
};

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [offset, setOffset] = useState(0);
  const [retakingQuizId, setRetakingQuizId] = useState<string | null>(null);
  const [isPendingRetake, startRetakeTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    quizId: string;
    title: string;
  } | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const { data, isLoading, isFetching } = trpc.quiz.history.useQuery({
    limit: PAGE_SIZE,
    offset,
  });

  const deleteMutation = trpc.quiz.delete.useMutation({
    onMutate: ({ quizId }) => setDeletingId(quizId),
    onSettled: () => {
      setDeletingId(null);
      setDeleteTarget(null);
      utils.quiz.history.invalidate();
    },
  });

  const openDeleteDialog = (quizId: string, title: string) => {
    setDeleteTarget({ quizId, title });
    deleteDialogRef.current?.showModal();
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    deleteMutation.mutate({ quizId: deleteTarget.quizId });
    deleteDialogRef.current?.close();
  };

  const handleRetake = (quizId: string) => {
    setRetakingQuizId(quizId);
    startRetakeTransition(async () => {
      await utils.quiz.getById.ensureData({ quizId });
      router.push(`/dashboard/quiz/${quizId}`);
    });
  };

  if (isLoading) {
    return (
      <Loading
        title="Loading History..."
        description="Fetching your past quizzes"
      />
    );
  }

  const attempts = data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-2 pt-6 pb-12">
      <div className="mb-6 flex items-center gap-3">
        <History className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-bold text-2xl">Quiz History</h1>
          <p className="text-base-content/60 text-sm">Your past attempts</p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="card border border-base-content/10 bg-base-100 shadow-sm">
          <div className="card-body items-center py-20 text-center">
            <div className="mb-4 text-6xl">📭</div>
            <h2 className="font-bold text-xl">No quizzes yet</h2>
            <p className="mb-6 text-base-content/60">
              Upload a PDF and generate your first quiz to see your history
              here.
            </p>
            <a href="/dashboard/start" className="btn btn-primary">
              Generate a Quiz
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <div
              key={attempt.attemptId}
              className="card border border-base-content/10 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
            >
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
                      className={`badge badge-soft font-bold ${SCORE_BADGE(attempt.score)}`}
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
                      className={`badge badge-soft capitalize ${DIFFICULTY_BADGE[attempt.difficulty] ?? ""}`}
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
                      onClick={() => handleRetake(attempt.quizId)}
                      disabled={
                        isPendingRetake && retakingQuizId === attempt.quizId
                      }
                    >
                      {isPendingRetake && retakingQuizId === attempt.quizId ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                      Retake
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-error btn-sm gap-1"
                      onClick={() =>
                        openDeleteDialog(attempt.quizId, attempt.title)
                      }
                      disabled={deletingId === attempt.quizId}
                    >
                      {deletingId === attempt.quizId ? (
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
          ))}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              disabled={offset === 0 || isFetching}
            >
              Previous
            </button>
            <span className="text-base-content/50 text-sm">
              Showing {offset + 1}–{offset + attempts.length}
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setOffset((o) => o + PAGE_SIZE)}
              disabled={attempts.length < PAGE_SIZE || isFetching}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      <dialog
        ref={deleteDialogRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete quiz?</h3>
          <p className="py-4 text-base-content/70">
            <span className="font-medium text-base-content">
              &ldquo;{deleteTarget?.title}&rdquo;
            </span>{" "}
            and all its attempts will be permanently deleted. This cannot be
            undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button type="submit" className="btn btn-ghost">
                Cancel
              </button>
            </form>
            <button
              type="button"
              className="btn btn-error"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>
    </div>
  );
}
