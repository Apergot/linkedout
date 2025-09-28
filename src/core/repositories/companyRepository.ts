import { type Company } from '../entities/company'
import { type Name } from '../valueObjects/name'

export interface CompanyRepository {
  create: (company: Company) => Promise<Company | null>
  findByName: (name: Name) => Promise<Company | null>
}
