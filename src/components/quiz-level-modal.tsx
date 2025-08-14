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
      <div className="modal-box max-w-sm text-center">
        <h3 className="font-semibold text-lg">Choose quiz difficulty</h3>
        <p className="text-sm opacity-70 mb-4">
          Select the difficulty level for the generated quiz.
        </p>

        <div className="flex justify-center gap-3 mb-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => handleProcessPdfWithLevel('easy')}
          >
            Easy
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleProcessPdfWithLevel('challenging but fair')}
          >
            Medium
          </button>
          <button
            type="button"
            className="btn btn-outline btn-error"
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
