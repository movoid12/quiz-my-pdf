export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <span className="loading loading-spinner loading-lg mb-4 text-primary"></span>
      <h2 className="mb-2 font-bold text-2xl">Loading Quiz...</h2>
      <p className="text-base-content/70">
        Please wait while we prepare your quiz
      </p>
    </div>
  );
}
  