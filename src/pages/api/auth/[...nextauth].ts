import FirestoreAdapter from "@/auth/firestoreAdapter"
import { db } from "@/gcp/firestore"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import SlackProvider from "next-auth/providers/slack"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GCP_OAUTH_CLIENT_ID as string,
            clientSecret: process.env.GCP_OAUTH_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        }),
        SlackProvider({
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
}
export default NextAuth(authOptions)
