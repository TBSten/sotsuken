import { z } from "zod"

export const PointSchema = z.object({
    pointId: z.string(),
    point: z.number(),
    status: z.enum(["pending", "granted", "rejected"]),
    createAt: z.number(),
    updateAt: z.number(),
})
export type Point = z.infer<typeof PointSchema>

export const PointCommentSchema = z.object({
    commentId: z.string(),
    text: z.string(),
    authorId: z.string(),
    createAt: z.number(),
    updateAt: z.number(),
})
export type PointComment = z.infer<typeof PointCommentSchema>
