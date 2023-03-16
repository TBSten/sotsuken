import { users } from "@/auth/users";
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
        createAt: now,
        updateAt: now,
        ...input,
    }
    await points(userId).doc(pointId).set(newPoint)
    return newPoint
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
    const snap = await points(userId)
        .where("status", "==", "granted")
        .get()
    const grantedPoints = snap.docs.map(d => d.data())
    return grantedPoints.reduce((ans, p) => ans + p.point, 0)
}


