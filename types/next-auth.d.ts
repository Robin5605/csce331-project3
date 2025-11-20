import NextAuth from "next-auth";

export type Role = "manager" | "cashier" | "customer";

declare module "next-auth" {
    interface User {
        id: string;
        role: Role;
    }

    interface Session {
        user: {
            id: string;
            role: Role;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
    }
}
