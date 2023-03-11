import { AppRouter } from "@/pages/api/trpc/[trpc]"
import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        return {
            links: [
                httpBatchLink({
                    url: "/api/trpc"
                })
            ],
        }
    }
})
