import { NextResponse } from "next/server";
import { insert_into_menu_management_table, populate_menu_management_table } from "@/lib/db";


/**
 * GET request to get all menu items from database.
 */
export async function GET(){
    const rows = await populate_menu_management_table();
    return NextResponse.json(rows);
}

/**
 * POST request to add a new item to the menu database.
 */
export async function POST(req: Request){
    const b = await req.json();
    const { name, categoryId, stock, cost } = b;

    const rows = await insert_into_menu_management_table(name, categoryId, stock, cost);

    return NextResponse.json(rows[0], {status: 201});

}