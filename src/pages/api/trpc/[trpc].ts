import { getUser } from "@/auth/users";
import { addSkillAssessment, deleteSkillAssessment, getAllSkillAssessment, updateSkillAssessment } from "@/skillAssessment";
import { SkillAssessment, SkillAssessmentTemplate, SkillAssessmentTemplateSchema } from "@/skillAssessment/types";
import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
    const session = await getServerSession(req, res, authOptions)
    return {
        session,
    }
}

export const t = initTRPC.context<typeof createContext>().create()

const UpdateSkillAssessmentInput = SkillAssessmentTemplateSchema.extend({
    assessmentId: z.string(),
})

const skillAssessmentDefault: SkillAssessmentTemplate = {
    skill: "",
    interest: false,
    comment: "",
    assessment: 0,
}
export const appRouter = t.router({
    skillAssessment: t.router({
        add: t.procedure
            .input(SkillAssessmentTemplateSchema.default(skillAssessmentDefault))
            .mutation(async ({ input: template, ctx: { session } }): Promise<SkillAssessment> => {
                if (!session) throw new TRPCError({ code: "UNAUTHORIZED" })
                const userId = session.user.userId
                const now = Date.now()
                const assessmentId = uuidv4()
                const skillAssessment: SkillAssessment = {
                    ...template,
                    userId,
                    createAt: now,
                    updateAt: now,
                    assessmentId,
                }
                const newSkillAssessment = await addSkillAssessment(session.user.userId, skillAssessment)
                return newSkillAssessment
            }),
        update: t.procedure
            .input(UpdateSkillAssessmentInput)
            .mutation(async ({ input: skillAssessment, ctx }) => {
                const session = ctx.session
                if (!session) throw new TRPCError({ code: "FORBIDDEN" })
                const newSkillAssessment = await updateSkillAssessment(skillAssessment.assessmentId, skillAssessment)
                return newSkillAssessment
            }),
        delete: t.procedure
            .input(z.string())
            .mutation(async ({ input: assessmentId, ctx }) => {
                await deleteSkillAssessment(assessmentId)
            }),
        getAll: t.procedure
            .query(async ({ }) => {
                const results = await getAllSkillAssessment()
                return results
            }),
        // search: t.procedure
        //     .input(SkillAssessmentSearchInputSchema)
        //     .query(async ({ input }) => {
        //         const results = await searchSkillAssessment(input)
        //         return results
        //     }),
    }),
    user: t.router({
        get: t.procedure
            .input(z.string())
            .query(async ({ input: userId }) => {
                const user = await getUser(userId)
                return user
            }),
    }),
})
export const hoge = "this is very important value"
export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
})
