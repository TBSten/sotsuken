import { users } from "@/auth/users"


export const resetUsersThanksLimit = async () => {
    const thankLimit = 100
    const snap = await users.get()
    snap.docs.map(async d => {
        await d.ref.set({ thankLimit }, { merge: true })
    })
}
