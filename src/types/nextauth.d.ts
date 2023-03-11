import { Stars } from "@/pages/stars/types"
import "next-auth"
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            userId: string
        }
    }
    interface User extends DefaultUser {
        stars: Stars[]
    }
}
