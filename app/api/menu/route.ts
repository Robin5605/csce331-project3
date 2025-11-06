import { NextResponse } from "next/server";
import {
    insert_into_menu_management_table,
    populate_menu_management_table,
} from "@/lib/db";

/**
 * GET request to get all menu items from database.
 */
export async function GET() {
    const rows = await populate_menu_management_table();
    return NextResponse.json(rows);
}

/**
 * POST request to add a new item to the menu database.
 */
export async function POST(req: Request) {
    const b = await req.json();
    const { name, categoryId, stock, cost } = b;
    
    // Run validation on inputted values
    if(!name || name.trim() === "" || typeof name !== "string"){
        return NextResponse.json({error: "Name is required."}, { status : 400 });
    }

    const stockNum = Number(stock);
    const costNum = Number(cost); 

    if(!Number.isFinite(stockNum) || stockNum < 0){
        return NextResponse.json({error: "Invalid stock."}, {status: 400});
    }

    if(!Number.isFinite(costNum) || costNum < 0){
        return NextResponse.json({error: "Invalid cost."}, {status : 400});
    }

    let catId = null;
    if (categoryId !== null && categoryId !== undefined && categoryId !== "") {
        const cid = Number(categoryId);
        if (!Number.isFinite(cid)) {
            return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
        }
        catId = cid;
    }


    const rows = await insert_into_menu_management_table(
        name,
        categoryId,
        stock,
        cost,
    );

    return NextResponse.json(rows[0], { status: 201 });
}
