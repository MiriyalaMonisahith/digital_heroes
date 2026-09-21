"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { charitySchema } from "@/lib/validations";
import type { ActionState } from "@/lib/actions/auth";

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

export async function upsertCharity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id");
  const parsed = charitySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    tagline: formData.get("tagline") ?? "",
    description: formData.get("description") ?? "",
    website: formData.get("website") ?? "",
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the charity details." };
  }

  const { supabase } = await requireAdmin();
  const { name, slug, tagline, description, website, isFeatured } = parsed.data;

  let imageUrl: string | undefined;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) return { error: "Charity image must be an image file." };
    if (image.size > 5 * 1024 * 1024) return { error: "Image must be under 5MB." };

    const ext = image.name.split(".").pop() || "jpg";
    const path = `${slug}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("charity-images")
      .upload(path, image, { upsert: true, contentType: image.type });
    if (uploadError) return { error: uploadError.message };

    const { data: publicUrl } = supabase.storage.from("charity-images").getPublicUrl(path);
    imageUrl = publicUrl.publicUrl;
  }

  const payload = {
    name,
    slug,
    tagline,
    description,
    website: website || null,
    is_featured: isFeatured,
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  const { error } =
    typeof id === "string" && id
      ? await supabase.from("charities").update(payload).eq("id", id)
      : await supabase.from("charities").insert(payload);

  if (error) {
    if (error.code === "23505") return { error: "That slug is already in use." };
    return { error: error.message };
  }

  revalidatePath("/admin/charities");
  revalidatePath("/charities");
  revalidatePath("/");
  return { success: typeof id === "string" && id ? "Charity updated." : "Charity created." };
}

export async function deleteCharity(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const { supabase } = await requireAdmin();
  await supabase.from("charities").delete().eq("id", id);

  revalidatePath("/admin/charities");
  revalidatePath("/charities");
  revalidatePath("/");
}
