import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    image: z.string().nullish(),
    // stars: SkillAssessmentSchema.array(),
})

