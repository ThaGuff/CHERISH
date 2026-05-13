"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col items-center justify-center px-4">
      <span className="text-5xl mb-4">😔</span>
      <h2 className="font-display text-2xl font-bold text-cherish-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-cherish-900/50 mb-6 text-center max-w-sm">
        We hit an unexpected error loading this page.
      </p>
      <button onClick={() => reset()} className="btn-primary">
        Try Again
      </button>
    </div>
  );
}
