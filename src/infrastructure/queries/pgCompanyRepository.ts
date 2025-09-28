import { type CompanyRepository } from '../../core/repositories/companyRepository'
import { type Company } from '../../core/entities/company'
import { type Name } from '../../core/valueObjects/name'

export class PostgresCompanyRepository implements CompanyRepository {
  async create(company: Company): Promise<Company> {
    return await Promise.resolve(undefined)
  }

  async findByName(name: Name): Promise<Company | null> {
    return await Promise.resolve(undefined)
  }
}
