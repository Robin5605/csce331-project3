import { Client } from 'pg';
import { MenuItem } from './models';

const client = new Client();
await client.connect();

export async function fetch_all_menu_items(): Promise<MenuItem[]> {
    const result = await client.query<MenuItem>("SELECT * FROM menu");

    return result.rows;
}
