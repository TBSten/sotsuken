import { z } from "zod";

export const StarsSchema = z.object({
    // starsId: z.string(),
    skill: z.string(),
    assessment: z.number().min(0).max(1),
    comment: z.string(),
    interest: z.boolean(),
    createAt: z.number(),
    updateAt: z.number(),
})
export type Stars = z.infer<typeof StarsSchema>

export const StarsInputSchema = StarsSchema.pick({
    skill: true,
    assessment: true,
    comment: true,
    interest: true,
})
export type StarsInput = z.infer<typeof StarsInputSchema>
