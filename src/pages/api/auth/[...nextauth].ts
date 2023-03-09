import FirestoreAdapter from "@/auth/firestoreAdapter"
import { db } from "@/gcp/firestore"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"


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
    ],
    adapter: FirestoreAdapter(db),
}
export default NextAuth(authOptions)
