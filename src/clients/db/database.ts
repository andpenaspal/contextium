import dotenv from 'dotenv';
import pg from 'pg';
import { type QueryResult, type QueryResultRow, type Pool as TPool } from 'pg';

import logger from 'src/utils/logger';

dotenv.config();
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Pool } = pg;

class Database {
  private static instance: Database;
  private pool: TPool;

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false },
    });

    this.pool
      .connect()
      .then(() => logger.info('Connected to Supabase PostgreSQL'))
      .catch((err) => logger.error('Database connection error:', err));
  }

  public static getInstance(): Database {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T extends QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return await this.pool.query<T>(text, params);
  }

  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection closed');
  }
}

export default Database;
