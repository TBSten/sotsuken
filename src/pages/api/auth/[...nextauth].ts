import FirestoreAdapter from "@/auth/firestoreAdapter"
import { db } from "@/gcp/firestore"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import SlackProvider from "next-auth/providers/slack"

export const authOptions: NextAuthOptions = {
    providers: [
        SlackProvider({
            id: "slack",
            clientId: process.env.SLACK_CLIENT_ID as string,
            clientSecret: process.env.SLACK_CLIENT_SECRET as string,
        }),
    ],
    adapter: FirestoreAdapter(db),
    callbacks: {
        async session({ session, user }) {
            session.user.userId = user.id
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
}
export default NextAuth(authOptions)
