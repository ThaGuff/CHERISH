import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col">
      <nav className="px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl font-bold text-cherish-500"
        >
          Cherish.
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
