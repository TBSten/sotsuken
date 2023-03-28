import { AutoAwesome, CheckCircleOutline, HourglassTop, NotInterested, Remove, SvgIconComponent } from "@mui/icons-material"
import { ComponentProps } from "react"
import { z } from "zod"

interface Status {
    text: string,
    icon: SvgIconComponent,
    color: ComponentProps<SvgIconComponent>["color"],
}
export const status = ["pending", "granted", "rejected", "auto", "deducte"] as const
export const statusMap: Record<(typeof status)[number], Status> = {
    "auto": { text: "自動付与", icon: AutoAwesome, color: "success" },
    "pending": { text: "申請中", icon: HourglassTop, color: "warning" },
    "granted": { text: "付与済み", icon: CheckCircleOutline, color: "success" },
    "rejected": { text: "却下", icon: NotInterested, color: "warning" },
    "deducte": { text: "減点", icon: Remove, color: "error" },
}

export const PointSchema = z.object({
    pointId: z.string(),
    point: z.number(),
    status: z.enum(status),
    description: z.string(),
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
