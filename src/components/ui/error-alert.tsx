import LatticeLoader from '@/components/ui/lattice-loader';

type ErrorAlertProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="space-y-6">
      <div className="alert alert-error">
        {/* ai-quiz-generation.E_API.4 */}
        <LatticeLoader
          status="error"
          errorLabel="Error"
          glow
          showTimer={false}
        />
        <span>{message}</span>
        {onRetry && (
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
