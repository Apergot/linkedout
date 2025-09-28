import { type CompanyRepository } from '../../core/repositories/companyRepository'
import { CreateCompanyAction } from '../actions/company/createCompany'

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async create() {
    return CreateCompanyAction(this.companyRepository)
  }
}
