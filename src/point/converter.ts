import { FirestoreDataConverter } from "@google-cloud/firestore";
import { Point, PointSchema, Thank, ThankSchema } from "./type";

export const pointConverter: FirestoreDataConverter<Point> = {
    fromFirestore(snapshot) {
        const point = PointSchema.safeParse(snapshot.data())
        if (!point.success) throw new TypeError(`invalid type error : ${JSON.stringify(snapshot.data(), null, 2)} : exptected=Point`)
        return point.data
    },
    toFirestore(point) {
        return {
            ...point,
        }
    },
}

export const thankConverter: FirestoreDataConverter<Thank> = {
    fromFirestore(snapshot) {
        return ThankSchema.parse(snapshot.data())
    },
    toFirestore(thank) {
        return {
            ...thank,
        }
    }
}