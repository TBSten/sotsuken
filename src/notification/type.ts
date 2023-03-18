import { z } from "zod"

export const NotificationSchema = z.object({
    notificationId: z.string(),
    title: z.string().nullable(),
    message: z.string(),
    icon: z.string().nullable(),
    action: z.union([
        z.object({ type: z.literal("goto"), href: z.string() }),
        z.null(),
    ]),
    createAt: z.number(),
})
export type Notification = z.infer<typeof NotificationSchema>


