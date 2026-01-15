// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    'postgresql://postgres:pudit2010@localhost:5432/postgre_database'
});

export default connectionPool;
