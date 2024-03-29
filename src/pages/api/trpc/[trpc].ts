import { getAllUsers, getUser, isAdminUser } from "@/auth/users";
import { getAllNotifications } from "@/notification";
import { PointQuerySchema, addPoint, deletePoint, getAllPoints, getPoint, getTotalPoint, grantPoint, rejectPoint } from "@/point";
import { addThank, getThankLimit, getThanks } from "@/point/thanks";
import { PointSchema, ThankSchema } from "@/point/type";
import { addSkillAssessment, deleteSkillAssessment, getAllSkillAssessment, updateSkillAssessment } from "@/skillAssessment";
import { addSkillAssessmentTemplate, getAllSkillAssessmentTemplateMulti, updateSkillAssessmentTemplate } from "@/skillAssessment/template";
import { SkillAssessment, SkillAssessmentSchema, SkillAssessmentTemplateSchema } from "@/skillAssessment/types";
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

const UpdateSkillAssessmentInput = SkillAssessmentSchema

export const appRouter = t.router({
    skillAssessment: t.router({
        add: t.procedure
            .input(SkillAssessmentSchema.partial())
            .mutation(async ({ input, ctx: { session } }): Promise<SkillAssessment> => {
                if (!session) throw new TRPCError({ code: "UNAUTHORIZED" })
                const userId = session.user.userId
                const now = Date.now()
                const assessmentId = uuidv4()
                const skillAssessment: SkillAssessment = {
                    skill: "",
                    assessment: 0,
                    comment: "",
                    interest: false,
                    ...input,
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
        template: t.router({
            getAll: t.procedure
                .query(async ({ ctx: { session } }) => {
                    if (!(
                        session?.user.userId &&
                        await isAdminUser(session?.user.userId)
                    )) {
                        throw new TRPCError({ code: "FORBIDDEN" })
                    }
                    const skillAssessmentTemplates = await getAllSkillAssessmentTemplateMulti()
                    return skillAssessmentTemplates
                }),
            add: t.procedure
                .input(SkillAssessmentTemplateSchema.partial())
                .mutation(async ({ input: template }) => {
                    const [newTemplate] = await addSkillAssessmentTemplate(template)
                    return newTemplate
                }),
            update: t.procedure
                .input(z.object({
                    templateId: z.string(),
                    template: SkillAssessmentTemplateSchema.partial(),
                }))
                .mutation(async ({ input: { templateId, template } }) => {
                    await updateSkillAssessmentTemplate(templateId, template)
                }),
            delete: t.procedure
                .input(z.string())
                .mutation(async ({ input: templateId }) => {
                    await deleteSkillAssessment(templateId)
                }),
        }),
    }),
    user: t.router({
        get: t.procedure
            .input(z.string())
            .query(async ({ input: userId }) => {
                const user = await getUser(userId)
                return user
            }),
        list: t.procedure
            .query(async ({ ctx: { session } }) => {
                const users = await getAllUsers()
                return users
            }),
    }),
    notifications: t.router({
        get: t.procedure
            .query(async ({ ctx: { session } }) => {
                const userId = session?.user.userId
                if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" })
                const user = await getUser(userId)
                if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "invalid user " + JSON.stringify(user) })
                const notifications = await getAllNotifications(userId)
                return { notifications, lastReadAt: user.lastReadAt }
            }),
    }),
    point: t.router({
        add: t.procedure
            .input(z.object({
                point: PointSchema.partial(),
                userId: z.string().optional(),
            }))
            .mutation(async ({ input, ctx: { session } }) => {
                const sessionUserId = session?.user.userId
                const inputUserId = input.userId
                const userId = inputUserId ?? sessionUserId ?? null
                if (!sessionUserId) throw new TRPCError({ code: "UNAUTHORIZED" })
                const sessionUser = sessionUserId ? await getUser(sessionUserId) : null
                if (
                    // 管理者でないのに他のユーザに対してポイント付与しようとした
                    !sessionUser?.isAdmin &&
                    (inputUserId && inputUserId !== sessionUserId)
                ) throw new TRPCError({ code: "FORBIDDEN" })
                if (!userId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "not implement" })
                const newPoint = await addPoint(userId, input.point)
                return newPoint
            }),
        getAll: t.procedure
            .input(PointQuerySchema.nullable())
            .query(async ({ input: query, ctx: { session } }) => {
                if (!query) query = { userId: session?.user.userId }
                const res = await getAllPoints(query)
                return res
            }),
        getOne: t.procedure
            .input(z.object({
                pointId: z.string(),
            }))
            .query(async ({ input: { pointId } }) => {
                return await getPoint(pointId)
            }),
        total: t.procedure
            .input(z.object({
                userId: z.string(),
            }))
            .query(async ({ input: { userId } }) => {
                const totalPoint = await getTotalPoint(userId)
                return totalPoint
            }),
        delete: t.procedure
            .input(z.object({
                pointId: z.string(),
                userId: z.string(),
            }))
            .mutation(async ({ input: pointId, ctx }) => {
                // TODO 認証
                await deletePoint(pointId.userId, pointId.pointId)
            }),
        grant: t.procedure
            .input(z.object({
                pointId: z.string(),
            }))
            .mutation(async ({ input: { pointId }, ctx: { session } }) => {
                if (!isAdminUser(session?.user.userId)) throw new TRPCError({ code: "UNAUTHORIZED" })
                await grantPoint(pointId)
            }),
        reject: t.procedure
            .input(z.object({
                pointId: z.string(),
            }))
            .mutation(async ({ input: { pointId }, ctx: { session } }) => {
                if (!isAdminUser(session?.user.userId)) throw new TRPCError({ code: "UNAUTHORIZED" })
                await rejectPoint(pointId)
            }),
        thanks: t.router({
            add: t.procedure
                .input(ThankSchema.partial())
                .mutation(async ({ input, ctx: { session } }) => {
                    const sessionUserId = session?.user.userId
                    if (!sessionUserId) throw new TRPCError({ code: "UNAUTHORIZED" })
                    const balance = await getThankLimit(sessionUserId)
                    if (balance < (input.point ?? 0)) throw new TRPCError({ code: "FORBIDDEN", message: "上限に達しています。" })
                    if (sessionUserId === input.targetUserId) throw new TRPCError({ code: "BAD_REQUEST", message: "自分自身には感謝ポイントを贈れません。" })
                    return await addThank(sessionUserId, input)
                }),
            getAll: t.procedure
                .query(async ({ ctx: { session } }) => {
                    const sessionUserId = session?.user.userId
                    if (!sessionUserId) throw new TRPCError({ code: "UNAUTHORIZED" })
                    return await getThanks(sessionUserId)
                }),
            getLimit: t.procedure
                .query(async ({ ctx: { session } }) => {
                    const sessionUserId = session?.user.userId
                    if (!sessionUserId) throw new TRPCError({ code: "UNAUTHORIZED" })
                    return await getThankLimit(sessionUserId)
                }),
        }),
    }),
})
export const hoge = "this is very important value"
export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
})
