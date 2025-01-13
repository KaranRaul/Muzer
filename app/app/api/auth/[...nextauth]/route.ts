import { prismaCLient } from "@/app/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"



const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.AUTH_SECRET ?? "secret1",
    callbacks: {
        async signIn(params) {
            // console.log();
            if (!params.profile?.email)
                return false;
            await prismaCLient.user.create({
                data: {
                    email: params.profile?.email,
                    provider: "Google"

                }
            })
            return true;
        }
    }
});

export { handler as GET, handler as POST };