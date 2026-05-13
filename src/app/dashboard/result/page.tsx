import ErrorFallback from '@/components/ui/error-fallback';

export default function ResultLandingPage() {
  return (
    <ErrorFallback
      title="No Result Selected"
      description="Open a completed quiz from your history or finish a quiz to see its results."
    />
  );
}
