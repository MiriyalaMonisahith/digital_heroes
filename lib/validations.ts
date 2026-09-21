import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const scoreSchema = z.object({
  score: z.coerce.number().int().min(1, "Score must be 1-45").max(45, "Score must be 1-45"),
  playedOn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date"),
});

export const charitySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  tagline: z.string().trim().max(160).default(""),
  description: z.string().trim().max(4000).default(""),
  website: z.string().trim().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

export const subscribeSchema = z.object({
  plan: z.enum(["monthly", "yearly"]),
  charityId: z.string().uuid("Select a charity"),
  charityPercentage: z.coerce.number().min(10).max(100),
});

export const winnerProofSchema = z.object({
  drawResultId: z.string().uuid(),
});
