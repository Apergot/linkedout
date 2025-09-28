import { type CompanyRepository } from '../../../core/repositories/companyRepository'
import { Id } from '../../../core/valueObjects/id'
import { Name } from '../../../core/valueObjects/name'
import {
  InternalServerError,
  ValidationError,
} from '../../../core/common/error'
import { Company } from '../../../core/entities/company'

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
    const companyName = Name.create(request.name)

    const alreadyExistingCompany = await companyRepo.findByName(companyName)

    if (alreadyExistingCompany) {
      throw new ValidationError('A company with the given name exists already')
    }

    const newCompany = await companyRepo.create(
      new Company(Id.generateUniqueId(), companyName)
    )

    if (!newCompany) {
      throw new InternalServerError('Unable to create company')
    }

    return {
      id: newCompany.id.toString(),
      name: newCompany.name.toString(),
    }
  }
}
