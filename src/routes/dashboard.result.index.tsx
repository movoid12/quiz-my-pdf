import { createFileRoute } from '@tanstack/react-router';
import ErrorFallback from '@/components/ui/error-fallback';

export const Route = createFileRoute('/dashboard/result/')({
  component: ResultLandingPage,
});

function ResultLandingPage() {
  return (
    <ErrorFallback
      title="No Result Selected"
      description="Open a completed quiz from your history or finish a quiz to see its results."
    />
  );
}
