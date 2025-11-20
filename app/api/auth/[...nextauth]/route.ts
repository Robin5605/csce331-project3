import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "PIN Login",
            credentials: {
                id: { label: "ID", type: "text" },
                role: { label: "Role", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.id || !credentials.role) return null;

                return {
                    id: credentials.id,
                    role: credentials.role,
                } as any;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },

    // TODO: implement this properly so it logs user out after closing tabs
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                expires: undefined,
            },
        },
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id as string;

                if (account?.provider === "google") {
                    token.role = "customer";
                } else {
                    token.role = (user as any).role ?? "customer";
                }
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as any;
            return session;
        },

        async redirect({ url, baseUrl }) {
            return "/customerOrderTest";
        },
    },
});

export { handler as GET, handler as POST };
