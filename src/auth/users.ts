import { db } from "@/gcp/firestore";
import { initSkillAssessment } from "@/skillAssessment";
import { FirestoreDataConverter } from "@google-cloud/firestore";
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { UserSchema } from "./types";

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

export const initForSignUpUser = async (user: AdapterUser): Promise<AdapterUser> => {
    let newUser = await initSkillAssessment(user)
    return newUser
}

export const getUser = async (userId: string) => {
    const snap = await users.doc(userId).get()
    const userData = snap.data()
    return userData ?? null
}

export const getUsersByName = async (name: string) => {
    const snap = await users.where("name", "==", name).get()
    return snap.docs.map(d => d.data())
}

export const getAllUsers = async () => {
    const snap = await users.get()
    return snap.docs.map(doc => doc.data())
}

export const updateUser = async (userId: string, input: Partial<User>) => {
    await users.doc(userId).set(input, { merge: true })
    return await getUser(userId)
}

export const linkSlackIdAndUserId = async (slackId: string, userId: string) => {
    users.doc(userId).set({ slackId, }, { merge: true })
}

export const getUserBySlackId = async (slackId: string) => {
    const snap = await users.where("slackId", "==", slackId).get()
    if (snap.docs.length === 0) return null
    if (snap.docs.length !== 1) throw new Error("invalid users size ")
    return snap.docs[0].data()
}
