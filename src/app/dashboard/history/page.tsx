'use client';

import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import AttemptCard from '@/components/history/attempt-card';
import DeleteQuizDialog from '@/components/history/delete-quiz-dialog';
import HistoryEmptyState from '@/components/history/history-empty-state';
import HistoryPagination from '@/components/history/history-pagination';
import Loading from '@/components/ui/loading';
import { useDialog } from '@/hooks/use-dialog';
import { routes } from '@/lib/routes';
import {
  type DeleteTarget,
  HISTORY_PAGE_SIZE,
  useHistoryStore,
} from '@/lib/stores/history-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { trpc } from '@/lib/trpc';

export default function HistoryPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const addToast = useToastStore((state) => state.addToast);

  const offset = useHistoryStore((state) => state.offset);
  const retakingQuizId = useHistoryStore((state) => state.retakingQuizId);
  const deletingId = useHistoryStore((state) => state.deletingId);
  const nextPage = useHistoryStore((state) => state.nextPage);
  const prevPage = useHistoryStore((state) => state.prevPage);
  const setRetakingQuizId = useHistoryStore((state) => state.setRetakingQuizId);
  const setDeletingId = useHistoryStore((state) => state.setDeletingId);

  const {
    payload: deleteTarget,
    open: openDeleteDialog,
    close: closeDeleteDialog,
  } = useDialog<DeleteTarget>();

  const [isPendingRetake, startRetakeTransition] = useTransition();

  const { data, isLoading, isFetching } = trpc.quiz.history.useQuery({
    limit: HISTORY_PAGE_SIZE,
    offset,
  });

  const deleteMutation = trpc.quiz.delete.useMutation({
    onMutate: ({ quizId }) => setDeletingId(quizId),
    onSuccess: () => {
      addToast('success', 'Quiz deleted successfully');
    },
    onError: () => {
      addToast('error', 'Failed to delete quiz');
    },
    onSettled: () => {
      setDeletingId(null);
      closeDeleteDialog();
      utils.quiz.history.invalidate();
    },
  });

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    deleteMutation.mutate({ quizId: deleteTarget.quizId });
  };

  const handleRetake = (quizId: string) => {
    setRetakingQuizId(quizId);
    startRetakeTransition(async () => {
      await utils.quiz.getById.ensureData({ quizId });
      router.push(routes.dashboard.quiz(quizId));
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
        <HistoryEmptyState />
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <AttemptCard
              key={attempt.attemptId}
              attempt={attempt}
              isRetaking={isPendingRetake && retakingQuizId === attempt.quizId}
              isDeleting={deletingId === attempt.quizId}
              onRetake={handleRetake}
              onDelete={(quizId, title) => openDeleteDialog({ quizId, title })}
            />
          ))}

          <HistoryPagination
            offset={offset}
            count={attempts.length}
            pageSize={HISTORY_PAGE_SIZE}
            isFetching={isFetching}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </div>
      )}
      <DeleteQuizDialog
        target={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onClose={closeDeleteDialog}
      />
    </div>
  );
}
