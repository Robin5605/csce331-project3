import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

/**
 * GET request to get all menu items from database.
 */
export async function GET(){
    const { rows } = await pool.query(`
    SELECT id,
           name,
           category_id AS "categoryId",
           stock,
           cost::float8 AS cost
    FROM menu
    ORDER BY id
  `);

  return NextResponse.json(rows);
}

/**
 * POST request to add a new item to the menu database.
 */
export async function POST(req: Request){
    const b = await req.json();
    const { name, categoryId, stock, cost } = b;

    const { rows } = await pool.query(`
        INSERT into menu (name, category_id, stock, cost)
        VALUES ($1,$2,$3,$4)
        RETURNING id, name, category_id AS "categoryId", stock, cost::float8 AS cost`,
        [name, categoryId ?? null, stock ?? 0, cost ?? 0]
    );

    return NextResponse.json(rows[0], {status: 201});

}