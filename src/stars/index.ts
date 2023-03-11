import { getUser, users } from "@/auth/users";
import { Stars } from "@/pages/stars/types";
import { AdapterUser } from "next-auth/adapters";
import { getAllDefaultStarsMulti } from "./defaults";

export const initStars = async (user: AdapterUser): Promise<AdapterUser> => {
    // デフォルトのスキルを追加する
    const defaultStars = await getAllDefaultStarsMulti()
    return {
        ...user,
        stars: defaultStars,
    }
}

export const getStarsByUserId = async (userId: string): Promise<Stars[]> => {
    const user = await getUser(userId)
    return user?.stars ?? []
}

export const updateStars = async (userId: string, stars: Stars[]) => {
    await users.doc(userId)
        .set({ stars, }, { merge: true })
}

