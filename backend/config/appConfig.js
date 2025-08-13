import { Pool } from 'pg';

const SV_PORT = 3000;

const DB_USER = 'developer';
const DB_HOST = 'localhost';
const DB_DATABASE = 'pd_mateo_monsalve_bernerslee';
const DB_PASSWORD = '123456';
const DB_PORT = 5432;

const DB_POOL = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
});

export {
    SV_PORT,
    DB_POOL
}
