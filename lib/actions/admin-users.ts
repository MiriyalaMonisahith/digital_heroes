"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionStatus, UserRole } from "@/types/database";

const VALID_ROLES: UserRole[] = ["subscriber", "admin"];
const VALID_STATUSES: SubscriptionStatus[] = ["active", "inactive", "cancelled", "lapsed"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Admin access required");

  return { supabase, user };
}

export async function setUserRole(formData: FormData): Promise<void> {
  const userId = formData.get("userId");
  const role = formData.get("role");
  if (typeof userId !== "string" || typeof role !== "string") return;
  if (!VALID_ROLES.includes(role as UserRole)) return;

  const { supabase } = await requireAdmin();
  await supabase.from("profiles").update({ role: role as UserRole }).eq("id", userId);

  revalidatePath("/admin/users");
}

export async function setSubscriptionStatus(formData: FormData): Promise<void> {
  const userId = formData.get("userId");
  const status = formData.get("status");
  if (typeof userId !== "string" || typeof status !== "string") return;
  if (!VALID_STATUSES.includes(status as SubscriptionStatus)) return;

  const { supabase } = await requireAdmin();
  await supabase
    .from("subscriptions")
    .update({ status: status as SubscriptionStatus, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  revalidatePath("/admin/users");
}
