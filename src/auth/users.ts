import { db } from "@/gcp/firestore";
import { StarsSchema } from "@/pages/stars/types";
import { initStars } from "@/stars";
import { FirestoreDataConverter } from "@google-cloud/firestore";
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { z } from "zod";

const userConverter: FirestoreDataConverter<User> = {
    fromFirestore(userSnapshot) {
        return UserSchema.parse(userSnapshot.data())
    },
    toFirestore(user) {
        return user
    },
}
export const users = db.collection("users")
    .withConverter(userConverter)

const UserSchema = z.object({
    id: z.string(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    image: z.string().nullish(),
    stars: StarsSchema.array(),
})

export const initForSignUpUser = async (user: AdapterUser): Promise<AdapterUser> => {
    let newUser = await initStars(user)
    return newUser
}

export const getUser = async (userId: string) => {
    const snap = await users.doc(userId).get()
    const userData = snap.data()
    return userData ?? null
}

export const updateUser = async (userId: string, input: Partial<User>) => {
    await users.doc(userId).set(input, { merge: true })
    return await getUser(userId)
}
