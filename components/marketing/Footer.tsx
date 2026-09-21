import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-pine-900 text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-cream">
            digital<span className="italic text-sage-300">.heroes</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/60">
            Play your rounds, back a cause, and be in with a chance every month — golf
            performance meets charitable giving.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-300">
            Platform
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/#how-it-works" className="hover:text-cream">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/charities" className="hover:text-cream">
                Charity directory
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-cream">
                Subscribe
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-300">
            Account
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/login" className="hover:text-cream">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-cream">
                My dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/40">
        Digital Heroes — demo build. No real payments are processed.
      </div>
    </footer>
  );
}
