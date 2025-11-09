import { NextResponse } from "next/server";
import {  
    insert_into_drinks_ingredients_table,
    insert_into_drinks_orders_table,
    insert_into_orders_table
} from "@/lib/db";

//idk why any of this has to be this way
export async function POST(req: Request){
    console.log("hi");
    const thing = await req.json();
    console.log("hello");
    const { cost, employeeId, paymentMethod } = thing;
    console.log("hey");
    const rows = await insert_into_orders_table(cost, employeeId, paymentMethod);
    console.log("howdy");
    console.log(rows[0]);

    return NextResponse.json(rows[0], { status: 201});
}