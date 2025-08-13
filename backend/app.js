import express from 'express';
import cors from 'cors';

import { SV_PORT, DB_POOL } from './config/appConfig.js';
import { loadTables } from './config/dbConfig.js'

import router from './router.js';

const app = express();

const corsOptions = {
   origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', router);

DB_POOL.connect()
    .then(() => console.log('Database connected successfully'))
    .then(loadTables)
    .catch(err => console.error('Database connection error:', err));

app.listen(SV_PORT, () => {
    console.log(`Server is running on port ${SV_PORT}`);
})