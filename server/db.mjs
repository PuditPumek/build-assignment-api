import * as PG from 'pg';

const { Pool } = PG;

const connectionPool = new Pool({
    connectionString:'postgresql://postgres:pudit2010@localhost:5432/postgres'
});

export default connectionPool;