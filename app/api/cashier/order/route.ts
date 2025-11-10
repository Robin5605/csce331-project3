import { NextResponse } from "next/server";
import { insert_into_orders_table } from "@/lib/db";

//idk why any of this has to be this way
export async function POST(req: Request) {
    const thing = await req.json();
    const { cost, employeeId, paymentMethod } = thing;
    const rows = await insert_into_orders_table(
        cost,
        employeeId,
        paymentMethod,
    );
    //console.log(rows[0]);

    return NextResponse.json(rows[0], { status: 201 });
}
