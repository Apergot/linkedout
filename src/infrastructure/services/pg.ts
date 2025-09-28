import { Pool } from 'pg'
import config from '../../config'

const pool = new Pool({
  host: config.databaseHost(),
  port: config.databasePort(),
  user: config.databaseUser(),
  password: config.databasePassword,
  database: config.databaseName(),
  max: 100,
  idleTimeoutMillis: 30000,
})

export default pool
