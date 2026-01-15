import * as PG from 'pg';
const { Pool } = PG.default;

const connectionPool = new Pool({
    connectionString:'postgresql://postgres:pudit2010@localhost:5432/postgre_database'
});

export default connectionPool;