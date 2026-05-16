type ErrorAlertProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="space-y-6">
      <div className="alert alert-error">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Error Icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
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
