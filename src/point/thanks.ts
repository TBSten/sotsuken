import { getUser, isExistsUser, users } from "@/auth/users";
import { lines } from "@/util/text";
import { FieldValue } from "@google-cloud/firestore";
import { v4 as uuidv4 } from "uuid";
import { addPoint } from ".";
import { thankConverter } from "./converter";
import { Thank } from "./type";

export const thanks = (userId: string) => users.doc(userId).collection("thanks").withConverter(thankConverter)

export const addThank = async (thankByUserId: string, input: Partial<Thank>) => {
    if (!input.point || !input.reason || !input.targetUserId) throw new Error(`invalid add thank input : ${JSON.stringify(input)}`)
    const safeInput = input as Pick<Thank, "point" | "reason" | "targetUserId">
    const thankId = uuidv4()
    const now = Date.now()
    const newThank: Thank = {
        ...safeInput,
        thankId,
        createAt: now,
        updateAt: now,
    }
    const usableThankLimit = await getThankLimit(thankByUserId)
    if (usableThankLimit < newThank.point) throw new Error(`can not send thank by thank limit . you can use ${usableThankLimit} point , but you tried to use ${newThank.point}`)
    const thankByUser = await getUser(thankByUserId)
    if (!thankByUser) throw new Error(`invalid user : not exists id=${thankByUser}`)
    // TODO: targetUserの存在チェック
    if (!isExistsUser(newThank.targetUserId)) throw new Error(`invalid user : not exists id=${thankByUser}`)
    await thanks(thankByUserId).doc(thankId).set(newThank)
    await addPoint(newThank.targetUserId, {
        point: newThank.point,
        status: "thank",
        description: lines([
            `${thankByUser.name} からの感謝ポイント`,
            "------------------",
            newThank.reason,
        ]),
    })
    await consumeThankLimit(thankByUserId, newThank.point)
    return newThank
}

/* 指定したユーザが送信した感謝ポイント一覧 */
export const getThanks = async (userId: string) => {
    const snap = await thanks(userId).orderBy("createAt").get()
    return snap.docs.map(d => d.data())
}

export const getThankLimit = async (userId: string) => {
    const user = await getUser(userId)
    if (!user) throw new Error(`invalid user : not exists userId=${userId}`)
    return user.thankLimit
}

export const consumeThankLimit = async (userId: string, thankPoint: number) => {
    await users.doc(userId).set({ thankLimit: FieldValue.increment(-thankPoint) }, { merge: true })
}
