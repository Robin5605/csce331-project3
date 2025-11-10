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

export async function insert_into_orders_table(
    cost: number,
    employeeId: number,
    paymentMethod: string
) {
    //console.log(`cost: ${cost}`);
    //console.log(`empl id: ${employeeId}`);
    //console.log(`pymnt mthd: ${paymentMethod}`);
    const { rows } = await client.query(
        `
        INSERT into orders (cost, employee_id, payment_method, placed_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id`,
        [cost ?? 0,employeeId ?? "1",paymentMethod ?? "CARD"],
    );

    return rows;
}

export async function insert_into_drinks_orders_table(
    menuId: number,
    orderId: number
) {
    const { rows } = await client.query(
        `
        INSERT into drinks_orders (menu_id, order_id)
        VALUES (${menuId},${orderId})
        RETURNING id`
    );

    return rows;
}

export async function insert_into_drinks_ingredients_table(
    drinkId: number,
    ingredientId: number,
    servings: number
) {
    //console.log(drinkId);
    //console.log(ingredientId);
    //console.log(servings);
    const { rows } = await client.query(
        `
        INSERT into drinks_ingredients (drink_id, ingredient_id, servings)
        VALUES (${drinkId},${ingredientId},${servings})
        RETURNING id`
    );

    return rows;
}

export async function update_ingredient_inventory(
    ammount: number,
    ingredient_id: number
) {
    //console.log(`ingredient_id ${ingredient_id}`);
    //console.log(`ammount ${ammount}`);
    const { rows } = await client.query(
        `UPDATE ingredients SET stock = stock - ${ammount} WHERE id = ${ingredient_id}`
    );
}