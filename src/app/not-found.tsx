import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">📖</span>
      <h1 className="font-display text-3xl font-bold text-cherish-900 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-cherish-900/50 mb-6 text-center max-w-sm">
        This memory doesn&apos;t exist yet. Maybe it&apos;s waiting to be created.
      </p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
