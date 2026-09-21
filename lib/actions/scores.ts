"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scoreSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/actions/auth";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

export async function addScore(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = scoreSchema.safeParse({
    score: formData.get("score"),
    playedOn: formData.get("playedOn"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid score and date." };
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("scores").insert({
    user_id: user.id,
    score: parsed.data.score,
    played_on: parsed.data.playedOn,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You already logged a score for that date — edit it instead." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/scores");
  revalidatePath("/dashboard");
  return { success: "Score added." };
}

export async function updateScore(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing score id." };

  const parsed = scoreSchema.safeParse({
    score: formData.get("score"),
    playedOn: formData.get("playedOn"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid score and date." };
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("scores")
    .update({ score: parsed.data.score, played_on: parsed.data.playedOn })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "You already logged a score for that date." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/scores");
  revalidatePath("/dashboard");
  return { success: "Score updated." };
}

export async function deleteScore(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const { supabase, user } = await requireUser();
  await supabase.from("scores").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard/scores");
  revalidatePath("/dashboard");
}
