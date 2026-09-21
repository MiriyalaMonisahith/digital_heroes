import { createClient } from "@/lib/supabase/server";
import type { Charity } from "@/types/database";

export async function getFeaturedCharities(): Promise<Charity[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: true })
      .limit(3);
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllCharities(): Promise<Charity[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCharityBySlug(slug: string): Promise<Charity | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data ?? null;
  } catch {
    return null;
  }
}
