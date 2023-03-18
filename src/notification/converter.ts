import { FirestoreDataConverter } from "@google-cloud/firestore";
import { Notification, NotificationSchema } from "./type";

export const notificationConverter: FirestoreDataConverter<Notification> = {
    fromFirestore(snapshot) {
        return NotificationSchema.parse(snapshot.data())
    },
    toFirestore(notification) {
        return { ...notification }
    },
}