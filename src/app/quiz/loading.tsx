export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      <h2 className="text-2xl font-bold mb-2">Loading Quiz...</h2>
      <p className="text-base-content/70">
        Please wait while we prepare your quiz
      </p>
    </div>
  );
}
