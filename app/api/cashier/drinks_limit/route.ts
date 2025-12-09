import { NextResponse } from "next/server";
import { populate_ingredient_management_table } from "@/lib/db";

export async function POST(req: Request) {
    
    //Gets the items that will be checked out
    const json = (await req.json()) as {
        cost: number;
        employeeId: string;
        paymentMethod: string;
    };
    console.log(json);

    //Gets the ingredients in the database
    const rows = await populate_ingredient_management_table();
    let isEnough = false;

    //If the ingredients in the database are less than their respective items being checked out, return the list of those items along with false
    

    //Otherwise, return an empty list along with true.


    console.log("Successfully created order");

    return NextResponse.json(rows[0], { status: 201 });
}
