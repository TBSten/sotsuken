import { db } from "@/gcp/firestore"
import { Stars, StarsInput } from "@/pages/stars/types"
import { starsConverter } from "./converter"

const defaultStars = db.collection("settings").doc("defaultStars").collection("values")
    .withConverter(starsConverter)

export const getDefaultStars = async (starsId: string): Promise<Stars | null> => {
    const starsSnap = await defaultStars.doc(starsId).get()
    const starsData = starsSnap.data()
    if (!starsData) return null
    return starsData
}
export const getAllDefaultStarsMulti = async () => {
    const starsSnap = await defaultStars.get()
    return starsSnap.docs.map(doc => doc.data())
}

export const addDefaultStars = async (...inputs: StarsInput[]) => {
    const newStars = await Promise.all(inputs.map(async input => {
        // const starsId = uuidv4()
        const stars: Stars = {
            // starsId,
            createAt: Date.now(),
            updateAt: Date.now(),
            ...input,
        }
        await defaultStars.add(stars)
        return stars
    }))
    return newStars
}
