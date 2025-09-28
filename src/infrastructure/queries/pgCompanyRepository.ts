import { type CompanyRepository } from '../../core/repositories/companyRepository'
import { Company } from '../../core/entities/company'
import { Name } from '../../core/valueObjects/name'
import { withPgClient } from './pgQueryExecutor'
import { type QueryConfig } from 'pg'
import { Id } from '../../core/valueObjects/id'

export class PostgresCompanyRepository implements CompanyRepository {
  async create(company: Company): Promise<Company | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `INSERT INTO companies (id, name) VALUES ($1, $2) RETURNING *`,
        values: [company.id.toString(), company.name.toString()],
      }

      const { rows } = await pgClient.query(queryConfig)

      return rows.length > 0
        ? PostgresCompanyRepository.mapToCompany(rows[0])
        : null
    })
  }

  async findByName(name: Name): Promise<Company | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `SELECT * FROM companies WHERE name = $1 LIMIT 1`,
        values: [name.toString()],
      }

      const { rows } = await pgClient.query(queryConfig)

      return rows.length > 0
        ? PostgresCompanyRepository.mapToCompany(rows[0])
        : null
    })
  }

  private static mapToCompany(company: any) {
    return new Company(Id.createFrom(company.id), Name.create(company.name))
  }
}
