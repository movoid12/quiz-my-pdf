'use client';

export default function HistoryPagination({
  offset,
  count,
  pageSize,
  isFetching,
  onPrev,
  onNext,
}: {
  offset: number;
  count: number;
  pageSize: number;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={onPrev}
        disabled={offset === 0 || isFetching}
      >
        Previous
      </button>
      <span className="text-base-content/50 text-sm">
        Showing {offset + 1}–{offset + count}
      </span>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={onNext}
        disabled={count < pageSize || isFetching}
      >
        Next
      </button>
    </div>
  );
}
