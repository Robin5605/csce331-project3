import { NextResponse } from "next/server";
import { createOrder, CreateOrder, insert_into_orders_table } from "@/lib/db";

export async function POST(req: Request) {
    const json = (await req.json()) as CreateOrder;
    console.log(json);

    await createOrder(json);

    console.log("Successfully created order");

    return NextResponse.json({ status: 204 });
}
