import { db } from "@/gcp/firestore";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const docId = Math.random() + ""
    await db.collection("test")
        .doc(docId)
        .set({
            arr: [
                { name: "hoge" },
            ],
        })
    const snap = await db.collection("test")
        .get()
    console.log(snap.docs.map(d => d.data()))
    res.json({})
}
export default handler
