import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/dashboard/Sidebar";

// Always render per-request: this section is entirely session-dependent, and
// wrapping Supabase calls in try/catch (for local dev without a live project)
// would otherwise hide Next's dynamic-rendering bailout signal from the build.
export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/scores", label: "Scores" },
  { href: "/dashboard/subscription", label: "Subscription" },
  { href: "/dashboard/draws", label: "Draws" },
  { href: "/dashboard/winnings", label: "Winnings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Sidebar
        items={items}
        brandLabel="Subscriber"
        userName={session.profile?.full_name || session.authUser.email || "Golfer"}
      />
      <main className="flex-1 bg-cream px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
