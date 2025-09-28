import { type Company } from '../entities/company'
import { type Name } from '../valueObjects/name'

export interface CompanyRepository {
  create: (company: Company) => Promise<Company>
  findByName: (name: Name) => Promise<Company | null>
}
