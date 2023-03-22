import { users } from "@/auth/users";
import { v4 as uuidv4 } from "uuid";
import { notificationConverter } from "./converter";
import { Notification } from "./type";

const notifications = (userId: string) => users.doc(userId).collection("notifications")
    .withConverter(notificationConverter)

export const addNotification = (userId: string, input: Partial<Notification>) => {
    const notificationId = uuidv4()
    const now = Date.now()
    const notification: Notification = {
        title: null,
        message: "",
        action: null,
        icon: null,
        createAt: now,
        ...input,
        notificationId,
    }
    notifications(userId).doc(notificationId).set(notification)
    return notification
}

export const getAllNotifications = async (userId: string) => {
    const snap = await notifications(userId)
        .orderBy("createAt", "desc")
        .get()
    return snap.docs.map(d => d.data())
}

export const readUp = async (userId: string, to: number = Date.now()) => {
    await users.doc(userId).set({ lastReadAt: to }, { merge: true })
}
