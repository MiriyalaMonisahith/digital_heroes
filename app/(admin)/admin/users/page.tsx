import { getAllUsersForAdmin } from "@/lib/data/admin";
import { setUserRole, setSubscriptionStatus } from "@/lib/actions/admin-users";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

const statusTone: Record<string, "sage" | "amber" | "danger" | "neutral"> = {
  active: "sage",
  inactive: "neutral",
  cancelled: "danger",
  lapsed: "amber",
};

export default async function AdminUsersPage() {
  const users = await getAllUsersForAdmin();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Users</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">User management</h1>
      <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
        {users.length} registered {users.length === 1 ? "user" : "users"}.
      </p>

      <div className="mt-8 space-y-4">
        {users.map((u) => (
          <Card key={u.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-charcoal-900">{u.full_name || "Unnamed"}</p>
                <Badge tone={u.role === "admin" ? "amber" : "neutral"}>{u.role}</Badge>
                <Badge tone={statusTone[u.subscription?.status ?? "inactive"]}>
                  {u.subscription?.status ?? "inactive"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-charcoal-500">{u.email ?? "Email hidden in local dev"}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <form action={setSubscriptionStatus} className="flex items-center gap-2">
                <input type="hidden" name="userId" value={u.id} />
                <Select name="status" defaultValue={u.subscription?.status ?? "inactive"} className="w-36">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="lapsed">Lapsed</option>
                </Select>
                <SubmitButton size="sm" variant="outline" pendingText="Saving…">
                  Update
                </SubmitButton>
              </form>

              <form action={setUserRole}>
                <input type="hidden" name="userId" value={u.id} />
                <input type="hidden" name="role" value={u.role === "admin" ? "subscriber" : "admin"} />
                <SubmitButton size="sm" variant="ghost" pendingText="Saving…">
                  {u.role === "admin" ? "Revoke admin" : "Make admin"}
                </SubmitButton>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
