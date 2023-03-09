import { Firestore } from "@google-cloud/firestore";

export const db = new Firestore()

export const log = async () => {
    await db.collection("log").add({ ts: new Date() })
}
