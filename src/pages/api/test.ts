import { getBonusTargets } from "@/point/batch/totalling";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    return res.json(await getBonusTargets())
}
export default handler
