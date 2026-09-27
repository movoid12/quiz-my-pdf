'use client';

import { routes } from '@/lib/routes';

export default function HistoryEmptyState() {
  return (
    <div className="card border border-base-content/10 bg-base-100 shadow-sm">
      <div className="card-body items-center py-20 text-center">
        <div className="mb-4 text-6xl">📭</div>
        <h2 className="font-bold text-xl">No quizzes yet</h2>
        <p className="mb-6 text-base-content/60">
          Upload a PDF and generate your first quiz to see your history here.
        </p>
        <a href={routes.dashboard.start} className="btn btn-primary">
          Generate a Quiz
        </a>
      </div>
    </div>
  );
}
