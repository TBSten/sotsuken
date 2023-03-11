import { StarsSchema } from "@/pages/stars/types";
import { updateStars } from "@/stars";
import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
    const session = await getServerSession(req, res, authOptions)
    return {
        session,
    }
}

export const t = initTRPC.context<typeof createContext>().create()

export const appRouter = t.router({
    stars: t.router({
        update: t.procedure
            .input(StarsSchema.array())
            .mutation(async ({ input: stars, ctx }) => {
                const session = ctx.session
                if (!session) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "please login",
                    })
                }
                await updateStars(session.user.userId, stars)
                return {
                    stars,
                }
            })
    }),
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
})
