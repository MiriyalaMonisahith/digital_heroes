import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-6 py-16">
      <div className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full bg-sage-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-amber-400/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 block text-center font-display text-xl text-charcoal-900"
        >
          digital<span className="text-sage-500 italic">.heroes</span>
        </Link>
        <div className="rounded-3xl border border-border bg-cream-card p-8 shadow-[0_1px_2px_rgba(35,41,31,0.04),0_20px_40px_-24px_rgba(35,41,31,0.35)]">
          {children}
        </div>
      </div>
    </div>
  );
}
