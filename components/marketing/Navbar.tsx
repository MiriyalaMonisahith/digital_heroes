import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LinkButton } from "@/components/ui/Button";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/charities", label: "Charities" },
  { href: "/#draws", label: "The draw" },
];

export async function Navbar() {
  const session = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-charcoal-900">
          digital<span className="text-sage-500 italic">.heroes</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-charcoal-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-sage-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <LinkButton
              href={session.profile?.role === "admin" ? "/admin" : "/dashboard"}
              size="sm"
            >
              {session.profile?.role === "admin" ? "Admin console" : "My dashboard"}
            </LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log in
              </LinkButton>
              <LinkButton href="/signup" variant="accent" size="sm">
                Subscribe
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
