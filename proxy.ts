import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const role = req.nextauth.token?.role;

        const { pathname } = req.nextUrl;

        // Allow NextAuth API routes (login, callback, session)
        if (pathname.startsWith("/api/auth")) {
            return NextResponse.next();
}

        // If no session, redirect to login
        if (!req.nextauth.token) {
            return NextResponse.redirect(new URL("/loginPage", req.url));
        }

        // Manager-only pages
        const managerPages = [
            "/managerPage",
            "/employees",
            "/ingredientManagementPage",
            "/menuManagementPage",
            "/x_and_z_reports",
        ];

        if (managerPages.some((page) => pathname.startsWith(page))) {
            if (role !== "manager") {
                return NextResponse.redirect(new URL("/CashierPage", req.url));
            }
        }

        // Cashier page
        if (pathname.startsWith("/CashierPage")) {
            if (role !== "cashier" && role !== "manager") {
                return NextResponse.redirect(new URL("/loginPage", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true,
        },
    },
);

export const config = {
    matcher: [
        "/api/auth/:path*",
        "/managerPage",
        "/CashierPage/:path*",
    ],
};
