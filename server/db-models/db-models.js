const { Pool } = require('pg');

import * as dotenv from 'dotenv';
dotenv.config();

const PG_URI = process.env.PG_URI;

const pool = new Pool({
  connectionString: PG_URI,
});

const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

export default query;

