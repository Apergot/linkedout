import type { Knex } from 'knex';
import * as dotenv from "dotenv";

dotenv.config();

const knexConfig: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
        },
        migrations: {
            directory: './migrations',
        },
    },
};

export default knexConfig;
