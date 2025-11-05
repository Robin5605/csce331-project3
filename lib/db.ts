import { Client } from "pg";
import { MenuItem } from "./models";

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

await client.connect();

export async function fetch_all_menu_items(): Promise<MenuItem[]> {
    const result = await client.query<MenuItem>("SELECT * FROM menu");

    return result.rows;
}

export async function populate_menu_management_table() {
    const { rows } = await client.query<MenuItem>(`SELECT id,
           name,
           category_id,
           stock,
           cost::float8 AS cost
    FROM menu
    ORDER BY id
  `);

    return rows;
}

export async function insert_into_menu_management_table(
    name: string,
    categoryId: number | null,
    stock: number,
    cost: number,
) {
    const { rows } = await client.query(
        `
        INSERT into menu (name, category_id, stock, cost)
        VALUES ($1,$2,$3,$4)
        RETURNING id, name, category_id, stock, cost::float8 AS cost`,
        [name, categoryId ?? null, stock ?? 0, cost ?? 0],
    );

    return rows;
}
