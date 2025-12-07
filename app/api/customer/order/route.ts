import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createOrder, CreateOrder, insert_into_orders_table } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    // Body comes from client (drinks, employeeId, paymentMethod)
    const body = (await req.json()) as Omit<CreateOrder, "userId">;
    console.log(body);

    // Get current session using the same authOptions we defined in auth route
    const session = await getServerSession(authOptions);

    // DB user id if logged in, otherwise null (guest order)
    const userId = session?.user?.id ? Number(session.user.id) : null;

    // Call createOrder with server-side userId, not trusting client
    await createOrder({
        ...body,
        userId, // optional field on CreateOrder
    });

    console.log("Successfully created order");

    // Return a proper status + json body
    return NextResponse.json(
        { success: true },
        { status: 201 }, // 201 Created is nice here
    );
}