import { Client } from 'pg';
import { MenuItem } from './models';

const client = new Client();
await client.connect();

