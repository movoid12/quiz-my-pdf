'use client';

export default function QuizLevelModal({
  handleProcessPdfWithLevel,
  setIsModalOpen,
}: {
  handleProcessPdfWithLevel: (level: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm text-start px-4">
        <h3 className="font-semibold text-lg">Choose quiz difficulty</h3>
        <p className="text-sm opacity-70 py-4">
          Select the difficulty level for the generated quiz.
        </p>

        <div className="join gap-1.5 join-vertical sm:join-horizontal flex justify-center">
          <button
            type="button"
            className="btn btn-primary btn-outline join-item"
            onClick={() => handleProcessPdfWithLevel('easy')}
          >
            Easy
          </button>
          <button
            type="button"
            className="btn btn-success btn-outline join-item"
            onClick={() => handleProcessPdfWithLevel('challenging but fair')}
          >
            Medium
          </button>
          <button
            type="button"
            className="btn btn-outline btn-error join-item"
            onClick={() => handleProcessPdfWithLevel('hard')}
          >
            Hard
          </button>
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
