import { z } from "zod";

export const clientInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(5000).optional().or(z.literal("").transform(() => undefined)),
  dob: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined))
    .transform((s) => (s ? new Date(s) : undefined))
    .refine((d) => d === undefined || !Number.isNaN(d.getTime()), { message: "Invalid date" }),
});

export type ClientInput = z.infer<typeof clientInputSchema>;
