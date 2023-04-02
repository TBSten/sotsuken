import { users } from "@/auth/users";
import { db } from "@/gcp/firestore";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { pointConverter } from "./converter";
import { Point, PointSchema } from "./type";

export const userPoints = (userId: string) =>
    users.doc(userId)
        .collection("points")
        .withConverter(pointConverter)

export const allPoints = () => db
    .collectionGroup("points")
    .withConverter(pointConverter)

export const addPoint = async (userId: string, input: Partial<Point>) => {
    const pointId = uuidv4()
    const now = Date.now()
    const newPoint: Point = {
        pointId,
        status: "pending",
        point: 1,
        description: "",
        createAt: now,
        updateAt: now,
        userId,
        ...input,
    }
    await userPoints(userId).doc(pointId).set(newPoint)
    return newPoint
}

export const getPoint = async (userId: string, pointId?: string) => {
    if (!pointId) {
        pointId = userId
        const snap = await db.collectionGroup("points")
            .withConverter(pointConverter)
            .where("pointId", "==", pointId)
            .get()
        if (snap.docs.length !== 1) {
            throw new Error("not implement docs length is invalid . " + pointId)
        }
        return snap.docs[0].data()
    }
    const snap = await userPoints(userId).doc(pointId).get()
    return snap.data()
}

export const PointQuerySchema = z.object({
    userId: z.string().optional(),
    status: PointSchema.shape.status.optional(),
})
export type PointQuery = z.infer<typeof PointQuerySchema>

export const getAllPoints = async (query: PointQuery) => {
    if (query.userId) {
        const snap = await userPoints(query.userId)
            .orderBy("updateAt", "desc")
            .get()
        const resultPoints = snap.docs.map(d => d.data())
        return resultPoints
    }
    if (query.status) {
        // statusがquery.statusであるポイント一覧を返す
        const snap = await allPoints()
            .where("status", "==", query.status)
            .orderBy("updateAt", "desc")
            .get()
        const statusPoints = snap.docs.map(d => d.data())
        return statusPoints
    }
    const snap = await allPoints()
        .orderBy("updateAt", "desc")
        .get()
    return snap.docs.map(d => d.data())
}

export const getPendingPoints = async (userId: string) => {
    const snap = await userPoints(userId)
        .where("status", "==", "pending")
        .orderBy("updateAt", "desc")
        .get()
    const resultPoints = snap.docs.map(d => d.data())
    return resultPoints
}

export const getTotalPoint = async (userId: string) => {
    const grantedSnap = await userPoints(userId)
        .where("status", "in", ["granted", "auto", "deducte", "thank"])
        .get()
    const allPoints = grantedSnap.docs.map(d => d.data())
    const total = allPoints.reduce((ans, p) => ans + p.point, 0)
    return total
}

export const deletePoint = async (userId: string, pointId: string) => {
    await userPoints(userId).doc(pointId).delete()
    // await deletePointComment(userId, pointId)
}

export const grantPoint = async (pointId: string) => {
    const targetRef = await allPoints()
        .where("pointId", "==", pointId)
        .get()
    if (targetRef.docs.length === 0) throw new Error(`pointId is invalid . point not exists . pointId:${pointId}`)
    if (targetRef.docs.length !== 1) throw new Error(`not implement`)
    await targetRef.docs[0].ref.set({ status: "granted" }, { merge: true })
}
export const rejectPoint = async (pointId: string) => {
    const targetRef = await allPoints()
        .where("pointId", "==", pointId)
        .get()
    if (targetRef.docs.length === 0) throw new Error(`pointId is invalid . point not exists . pointId:${pointId}`)
    if (targetRef.docs.length !== 1) throw new Error(`not implement`)
    await targetRef.docs[0].ref.set({ status: "rejected" }, { merge: true })
}

