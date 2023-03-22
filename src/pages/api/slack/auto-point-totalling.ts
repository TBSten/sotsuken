import { totalPoints } from "@/point/batch";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    if (req.body !== process.env.BATCH_AUTH_TOKEN) {
        return res.status(401).json({ msg: "invalid request body" })
    }
    await totalPoints()
    res.json({ msg: "ok" })
}

export default handler
