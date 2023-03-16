import { FirestoreDataConverter } from "@google-cloud/firestore";
import { PointComment, PointCommentSchema } from "../type";

export const commentConverter: FirestoreDataConverter<PointComment> = {
    fromFirestore(snapshot) {
        return PointCommentSchema.parse(snapshot.data())
    },
    toFirestore(comment) {
        return { ...comment }
    }
}
