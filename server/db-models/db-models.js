const { Pool } = require('pg');

<<<<<<< HEAD
require('dotenv').config();
=======
import * as dotenv from 'dotenv';
dotenv.config();
>>>>>>> dev

const PG_URI = process.env.PG_URI;

const pool = new Pool({
  connectionString: PG_URI,
});

<<<<<<< HEAD
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
=======
const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

export default query;
>>>>>>> dev
