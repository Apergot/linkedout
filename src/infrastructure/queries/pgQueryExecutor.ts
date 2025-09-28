import pool from '../services/pg'

type PgQueryExecutor<T> = (client: any) => Promise<T>

export async function withPgClient<T>(
  executor: PgQueryExecutor<T>
): Promise<T> {
  const pgClient = await pool.connect()

  try {
    return await executor(pgClient)
  } catch (err) {
    console.log('PG Execution error', err)
    throw err
  } finally {
    try {
      pgClient.release()
    } catch (err) {
      console.log('PG Client release error', err)
    }
  }
}
