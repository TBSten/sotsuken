import { DefaultSession, DefaultUser } from "next-auth";
import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    image: z.string().nullish(),
    // stars: SkillAssessmentSchema.array(),
    lastReadAt: z.number(),
})


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            userId: string
        }
    }
    interface User extends DefaultUser {
        // stars: SkillAssessment[]
        lastReadAt: number
    }
}

