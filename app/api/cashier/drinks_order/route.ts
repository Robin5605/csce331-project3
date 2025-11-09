import { NextResponse } from "next/server";
import {
    insert_into_drinks_orders_table
} from "@/lib/db";

//idk why any of this has to be this way
export async function POST(req: Request){
    const thing = await req.json();
    const { menuId, orderId } = thing;
    const rows = await insert_into_drinks_orders_table(menuId, orderId);

    return NextResponse.json(rows[0], { status: 201});
}