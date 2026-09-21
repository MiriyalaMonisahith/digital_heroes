import { createClient } from "@/lib/supabase/server";
import type { Profile, Subscription } from "@/types/database";

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    return { authUser: user, profile: profile ?? null };
  } catch {
    return null;
  }
}

export async function getCurrentSubscription(userId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single<Subscription>();
    return data ?? null;
  } catch {
    return null;
  }
}
