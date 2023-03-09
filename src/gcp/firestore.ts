import { Firestore } from "@google-cloud/firestore";

console.log("google_app_credentials", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const db = new Firestore()

export const log = async () => {
    await db.collection("log").add({ ts: new Date() })
}
