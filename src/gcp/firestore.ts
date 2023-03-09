import { Firestore } from "@google-cloud/firestore";

const db = new Firestore({
    keyFilename: "./gcp-web-server-key.json",
})

export const log = async () => {
    await db.collection("log").add({ ts: new Date() })
}
