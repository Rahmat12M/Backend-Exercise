import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABES_URL
});

export default pool;