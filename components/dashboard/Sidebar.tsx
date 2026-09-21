"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { logout } from "@/lib/actions/auth";

export interface NavItem {
  href: string;
  label: string;
}

export function Sidebar({
  items,
  brandLabel,
  userName,
}: {
  items: NavItem[];
  brandLabel: string;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full shrink-0 flex-col justify-between border-r border-border bg-cream-card px-5 py-6 sm:w-60">
      <div>
        <Link href="/" className="block font-display text-lg text-charcoal-900">
          digital<span className="italic text-sage-500">.heroes</span>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wide text-charcoal-500">
          {brandLabel}
        </p>

        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const active =
              item.href === "/dashboard" || item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sage-600 text-cream"
                    : "text-charcoal-700 hover:bg-sage-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <p className="truncate px-3.5 text-sm font-medium text-charcoal-900">{userName}</p>
        <form action={logout}>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl px-3.5 py-2.5 text-left text-sm text-charcoal-500 hover:bg-sage-100 hover:text-charcoal-900"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
