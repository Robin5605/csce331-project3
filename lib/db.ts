import { Client } from "pg";
import { MenuItem } from "./models";

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

await client.connect();

/**
 * Fetches all menu items from the database.
 * @return A promise that resolves to an array of MenuItem objects.
 */
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

// Function takes in the id of the menu item we want to delete and runs the sql query to do so. 
export async function delete_from_menu_management_table(
    id: number,
) {
    const { rows, rowCount } = await client.query(
        `
        DELETE FROM menu WHERE id = $1
        RETURNING id;
        `,
        [id]
    );

    if(rowCount == 0){
        throw new Error(`Menu item with id=${id} not found`);
    }

    return rows[0];
}