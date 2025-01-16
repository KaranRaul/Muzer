// import { prismaCLient } from "@/app/lib/db";
// import { AuthOptions, Profile, Session, TokenSet } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions: AuthOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
//         })
//     ],
//     secret: process.env.AUTH_SECRET ?? "secret1",
//     callbacks: {
//         async signIn({ profile }: { profile?: Profile }) {
//             if (!profile?.email) return false;

//             const existingUser = await prismaCLient.user.findFirst({
//                 where: { email: profile.email }
//             });

//             if (existingUser) {
//                 return true;
//             }

//             await prismaCLient.user.create({
//                 data: {
//                     email: profile.email,
//                     provider: "Google"
//                 }
//             });

//             return true;
//         },
//         async jwt({ token, profile }: { token: TokenSet; profile?: Profile }) {
//             if (profile) {
//                 const dbUser = await prismaCLient.user.findFirst({
//                     where: { email: profile.email }
//                 });
//                 if (dbUser) {
//                     token.id = dbUser.id;
//                 }
//             }
//             return token;
//         },
//         async session({ session, token }: { session: Session; token: TokenSet }) {
//             if (token.id) {
//                 session.user = {
//                     ...session.user,
//                     // @ts-expect-error
//                     id: token.id
//                 };
//             }
//             return session;
//         }
//     }
// };
import { prismaCLient } from "@/app/lib/db";
import { AuthOptions, Profile, Session, TokenSet } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.AUTH_SECRET ?? "secret1",
    callbacks: {
        async signIn({ profile }: { profile?: Profile }) {
            if (!profile?.email) return false;

            const existingUser = await prismaCLient.user.findFirst({
                where: { email: profile.email }
            });

            if (existingUser) {
                return true;
            }

            await prismaCLient.user.create({
                data: {
                    email: profile.email,
                    provider: "Google"
                }
            });

            return true;
        },
        async jwt({ token, profile }: { token: TokenSet; profile?: Profile }) {
            if (profile) {
                const dbUser = await prismaCLient.user.findFirst({
                    where: { email: profile.email }
                });
                if (dbUser) {
                    token.id = dbUser.id;
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: TokenSet }) {
            if (token.id) {
                session.user = {
                    ...session.user,
                    // @ts-expect-error: 'id' is a custom field added to the session object for identifying the user.
                    id: token.id
                };
            }
            return session;
        }
    }
};
