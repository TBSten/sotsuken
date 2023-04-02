import { getUser, isExistsUser, users } from "@/auth/users";
import { lines } from "@/util/text";
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
    return newThank
}

/* 指定したユーザが送信した感謝ポイント一覧 */
export const getThanks = async (userId: string) => {
    const snap = await thanks(userId).orderBy("createAt").get()
    return snap.docs.map(d => d.data())
}

export const getThankLimit = async (userId: string) => {
    return 100
}
