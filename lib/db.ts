import { Client } from 'pg';
import { MenuItem } from './models';
import { connection } from 'next/server';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
}
);
await client.connect();

export async function fetch_all_menu_items(): Promise<MenuItem[]> {
    const result = await client.query<MenuItem>("SELECT * FROM menu");

    return result.rows;
}

/**
 * Fetch login information from the database
 * @returns Promise resolving to login information
 */
export async function fetch_login_information(pin: string): Promise<{ pin: string }[]> {
    const query = 'SELECT is_manager, id, name FROM employees WHERE pin = $1;';
    const result = await client.query<{ pin: string }>(query, [pin]);

    return result.rows;
}