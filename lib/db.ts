import { Client } from "pg";
import { Employee, MenuItem } from "./models";

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

/**
 * Fetch login information from the database
 * @returns Promise resolving to login information
 */
export async function fetch_login_information(
    pin: string,
): Promise<{ is_manager: boolean; id: number; name: string }[]> {
    const query = "SELECT is_manager, id, name FROM employees WHERE pin = $1;";
    const result = await client.query<{
        is_manager: boolean;
        id: number;
        name: string;
    }>(query, [pin]);

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

export async function fetch_employee_data(): Promise<Employee[]> {
    const { rows } = await client.query<Employee>("SELECT * FROM employees");

    return rows;
}

export async function remove_employee(id: number): Promise<Employee | null> {
    const { rows } = await client.query<Employee>(
        "DELETE FROM employees WHERE id = $1 RETURNING *",
        [id],
    );

    return rows.length === 0 ? null : rows[0];
}

export async function updateEmployee(
    id: number,
    newName: string,
    newHoursWorked: number,
    newPin: number,
): Promise<Employee | null> {
    const { rows } = await client.query<Employee>(
        "UPDATE employees SET name = $2, hours_worked = $3, pin = $4 WHERE id = $1 RETURNING *",
        [id, newName, newHoursWorked, newPin],
    );

    return rows.length === 0 ? null : rows[0];
}
