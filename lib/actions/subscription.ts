"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { subscribeSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/actions/auth";
import { PLAN_PRICE } from "@/lib/plans";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

export async function subscribe(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = subscribeSchema.safeParse({
    plan: formData.get("plan"),
    charityId: formData.get("charityId"),
    charityPercentage: formData.get("charityPercentage"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your plan and charity choice." };
  }

  const { supabase, user } = await requireUser();
  const { plan, charityId, charityPercentage } = parsed.data;

  const startedAt = new Date();
  const renewsAt = new Date(startedAt);
  if (plan === "monthly") renewsAt.setMonth(renewsAt.getMonth() + 1);
  else renewsAt.setFullYear(renewsAt.getFullYear() + 1);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan,
      status: "active",
      charity_id: charityId,
      charity_percentage: charityPercentage,
      started_at: startedAt.toISOString(),
      renews_at: renewsAt.toISOString(),
      cancelled_at: null,
      is_mock_payment: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  const donationAmount = Math.round(PLAN_PRICE[plan] * (charityPercentage / 100) * 100) / 100;
  await supabase.from("donations").insert({
    user_id: user.id,
    charity_id: charityId,
    amount: donationAmount,
    type: "subscription_share",
  });

  revalidatePath("/dashboard", "layout");
  return { success: "Subscribed! This is a demo — no real payment was processed." };
}

export async function cancelSubscription(): Promise<void> {
  const { supabase, user } = await requireUser();
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("user_id", user.id);

  revalidatePath("/dashboard", "layout");
}
