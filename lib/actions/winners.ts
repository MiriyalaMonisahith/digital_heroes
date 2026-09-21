"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/auth";
import type { WinnerStatus } from "@/types/database";

const VALID_STATUSES: WinnerStatus[] = ["unverified", "pending", "approved", "rejected", "paid"];

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

export async function submitWinnerProof(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const winnerId = formData.get("winnerId");
  const file = formData.get("proof");

  if (typeof winnerId !== "string" || !winnerId) return { error: "Missing winner record." };
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a screenshot to upload." };
  if (!file.type.startsWith("image/")) return { error: "Upload an image file (PNG or JPG)." };
  if (file.size > 5 * 1024 * 1024) return { error: "Image must be under 5MB." };

  const { supabase, user } = await requireUser();

  const ext = file.name.split(".").pop() || "png";
  const path = `${user.id}/${winnerId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("winner-proofs")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { error } = await supabase
    .from("winners")
    .update({ proof_url: path, status: "pending", submitted_at: new Date().toISOString() })
    .eq("id", winnerId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/winnings");
  return { success: "Proof submitted — an admin will review it shortly." };
}

/** Admin: approve, reject, or mark a winner as paid. */
export async function updateWinnerStatus(formData: FormData): Promise<void> {
  const winnerId = formData.get("winnerId");
  const status = formData.get("status");
  if (typeof winnerId !== "string" || typeof status !== "string") return;
  if (!VALID_STATUSES.includes(status as WinnerStatus)) return;

  const { supabase, user } = await requireUser();

  await supabase
    .from("winners")
    .update({
      status: status as WinnerStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", winnerId);

  revalidatePath("/admin/winners");
}

/** Returns a short-lived signed URL for an admin (or the owner) to view a proof image. */
export async function getSignedProofUrl(path: string): Promise<string | null> {
  try {
    const service = createServiceClient();
    const { data, error } = await service.storage
      .from("winner-proofs")
      .createSignedUrl(path, 60 * 5);
    if (error) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
