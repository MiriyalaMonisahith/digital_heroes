import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { href: "/admin", label: "Reports" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/draws", label: "Draws" },
  { href: "/admin/charities", label: "Charities" },
  { href: "/admin/winners", label: "Winners" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session) redirect("/login");
  if (session.profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-pine-900 sm:flex-row">
      <Sidebar
        items={items}
        brandLabel="Admin console"
        userName={session.profile?.full_name || session.authUser.email || "Admin"}
      />
      <main className="flex-1 bg-cream px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
