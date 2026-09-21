import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Charity, Draw, Profile, Subscription, Winner } from "@/types/database";

export interface AdminOverview {
  totalUsers: number;
  activeSubscribers: number;
  totalPrizePool: number;
  totalCharityContributions: number;
  drawsPublished: number;
  pendingWinners: number;
  charityBreakdown: { charity: string; total: number }[];
}

export async function getAdminOverview(): Promise<AdminOverview> {
  try {
    const supabase = await createClient();

    const [{ count: totalUsers }, { count: activeSubscribers }, { data: draws }, { data: donations }, { count: pendingWinners }] =
      await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase.from("draws").select("pool_total, status").eq("status", "published").returns<
          { pool_total: number; status: string }[]
        >(),
        supabase
          .from("donations")
          .select("amount, charities(name)")
          .returns<{ amount: number; charities: { name: string } | null }[]>(),
        supabase
          .from("winners")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

    const totalPrizePool = (draws ?? []).reduce((sum, d) => sum + Number(d.pool_total), 0);
    const totalCharityContributions = (donations ?? []).reduce((sum, d) => sum + Number(d.amount), 0);

    const breakdownMap = new Map<string, number>();
    (donations ?? []).forEach((d) => {
      const name = d.charities?.name ?? "Unknown";
      breakdownMap.set(name, (breakdownMap.get(name) ?? 0) + Number(d.amount));
    });
    const charityBreakdown = Array.from(breakdownMap.entries())
      .map(([charity, total]) => ({ charity, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    return {
      totalUsers: totalUsers ?? 0,
      activeSubscribers: activeSubscribers ?? 0,
      totalPrizePool,
      totalCharityContributions,
      drawsPublished: draws?.length ?? 0,
      pendingWinners: pendingWinners ?? 0,
      charityBreakdown,
    };
  } catch {
    return {
      totalUsers: 0,
      activeSubscribers: 0,
      totalPrizePool: 0,
      totalCharityContributions: 0,
      drawsPublished: 0,
      pendingWinners: 0,
      charityBreakdown: [],
    };
  }
}

export interface AdminUserRow extends Profile {
  email: string | null;
  subscription: Subscription | null;
}

export async function getAllUsersForAdmin(): Promise<AdminUserRow[]> {
  try {
    const supabase = await createClient();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Profile[]>();

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .returns<Subscription[]>();

    const subsByUser = new Map((subs ?? []).map((s) => [s.user_id, s]));

    let emailByUser = new Map<string, string>();
    try {
      const service = createServiceClient();
      const { data: authUsers } = await service.auth.admin.listUsers({ perPage: 1000 });
      emailByUser = new Map((authUsers?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    } catch {
      // Service role key not configured yet (e.g. local placeholder env) — emails stay blank.
    }

    return (profiles ?? []).map((p) => ({
      ...p,
      email: emailByUser.get(p.id) ?? null,
      subscription: subsByUser.get(p.id) ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getAllWinnersForAdmin(): Promise<
  (Winner & { user_name: string; match_tier: string | null; prize_amount: number; draw_month: string | null })[]
> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("winners")
      .select("*, profiles(full_name), draw_results(match_tier, prize_amount, draws(month))")
      .order("created_at", { ascending: false })
      .returns<
        (Winner & {
          profiles: { full_name: string } | null;
          draw_results: {
            match_tier: string | null;
            prize_amount: number;
            draws: { month: string } | null;
          } | null;
        })[]
      >();

    return (data ?? []).map((w) => ({
      ...w,
      user_name: w.profiles?.full_name || "Unnamed subscriber",
      match_tier: w.draw_results?.match_tier ?? null,
      prize_amount: w.draw_results?.prize_amount ?? 0,
      draw_month: w.draw_results?.draws?.month ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getAllCharitiesForAdmin(): Promise<Charity[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("charities")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Charity[]>();
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllDrawsForAdmin(): Promise<Draw[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("month", { ascending: false })
      .returns<Draw[]>();
    return data ?? [];
  } catch {
    return [];
  }
}
