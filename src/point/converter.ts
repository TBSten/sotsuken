import { FirestoreDataConverter } from "@google-cloud/firestore";
import { Point, PointSchema } from "./type";

export const pointConverter: FirestoreDataConverter<Point> = {
    fromFirestore(snapshot) {
        return PointSchema.parse(snapshot.data())
    },
    toFirestore(point) {
        return {
            ...point,
        }
    },
}
