import { createFileRoute } from '@tanstack/react-router';
import ErrorFallback from '@/components/ui/error-fallback';

export const Route = createFileRoute('/dashboard/quiz/')({
  component: QuizLandingPage,
});

function QuizLandingPage() {
  return (
    <ErrorFallback
      title="Select a Quiz"
      description="Open a quiz from your history or generate a new one to start answering questions."
    />
  );
}
