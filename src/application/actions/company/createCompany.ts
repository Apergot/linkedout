import { type CompanyRepository } from '../../../core/repositories/companyRepository'
import { ValidationError } from '../../../core/common/error'

export interface CreateCompanyRequest {
  name: string
}

export interface CreateCompanyResponse {
  id: string
  name: string
}

export function CreateCompanyAction(companyRepo: CompanyRepository) {
  return async (
    request: CreateCompanyRequest
  ): Promise<CreateCompanyResponse> => {
    throw new ValidationError('Unable to create company')
  }
}
