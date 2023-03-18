import { users } from "@/auth/users";
import { db } from "@/gcp/firestore";
import { v4 as uuidv4 } from "uuid";
import { pointConverter } from "./converter";
import { Point } from "./type";

export const points = (userId: string) => users.doc(userId)
    .collection("points")
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
        ...input,
    }
    await points(userId).doc(pointId).set(newPoint)
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
    const snap = await points(userId).doc(pointId).get()
    return snap.data()
}

export const getAllPoints = async (userId: string) => {
    const snap = await points(userId)
        .orderBy("updateAt", "desc")
        .get()
    const userPoints = snap.docs.map(d => d.data())
    return userPoints
}

export const getPendingoints = async (userId: string) => {
    const snap = await points(userId)
        .where("status", "==", "pending")
        .orderBy("updateAt", "desc")
        .get()
    const userPoints = snap.docs.map(d => d.data())
    return userPoints
}

export const getTotalPoint = async (userId: string) => {
    const grantedSnap = await points(userId)
        .where("status", "in", ["granted", "auto"])
        .get()
    const allPoints = grantedSnap.docs.map(d => d.data())
    const total = allPoints.reduce((ans, p) => ans + p.point, 0)
    return total
}

export const deletePoint = async (userId: string, pointId: string) => {
    await points(userId).doc(pointId).delete()
    // await deletePointComment(userId, pointId)
}
