import { type UserRepository } from '../../core/repositories/userRepository'
import { User } from '../../core/entities/user'
import { withPgClient } from './pgQueryExecutor'
import { type QueryConfig } from 'pg'
import { Id } from '../../core/valueObjects/id'
import { Email } from '../../core/valueObjects/email'

export class PostgresUserRepository implements UserRepository {
  async create(user: User): Promise<User | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `INSERT INTO users (id, email, password_hash, company_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [
          user.id.toString(),
          user.email.toString(),
          user.passwordHash,
          user.companyId ? user.companyId.toString() : null,
        ],
      }
      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0 ? PostgresUserRepository.mapToUser(rows[0]) : null
    })
  }

  async findByEmail(email: Email): Promise<User | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `SELECT * FROM users WHERE email = $1 LIMIT 1`,
        values: [email.toString()],
      }
      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0 ? PostgresUserRepository.mapToUser(rows[0]) : null
    })
  }

  async findById(id: Id): Promise<User | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `SELECT * FROM users WHERE id = $1 LIMIT 1`,
        values: [id.toString()],
      }
      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0 ? PostgresUserRepository.mapToUser(rows[0]) : null
    })
  }

  async setCompanyId(id: Id, companyId: Id): Promise<User | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `UPDATE users SET company_id = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values: [id.toString(), companyId.toString()],
      }
      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0 ? PostgresUserRepository.mapToUser(rows[0]) : null
    })
  }

  private static mapToUser(row: any): User {
    return new User(
      Id.createFrom(row.id),
      Email.create(row.email),
      row.password_hash,
      row.company_id ? Id.createFrom(row.company_id) : null
    )
  }
}
