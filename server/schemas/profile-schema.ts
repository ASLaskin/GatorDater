import { z } from "zod"

export const profileUpdateSchema = z.object({
  name: z.string().optional(),
  bio: z.string().max(150, "Bio must be 150 characters or less").optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  image: z.string().optional(), 
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;