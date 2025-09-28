import { type JobPostRepository } from '../../../core/repositories/jobPostRepository'
import { Id } from '../../../core/valueObjects/id'
import { NotFoundError } from '../../../core/common/error'

export interface GetJobPostByIdRequest {
  id: string
}

export interface GetJobPostByIdResponse {
  id: string
  companyId: string
  title: string
  location: string
  description: string
  contractType: string
  minSalaryMoney?: string | null
  maxSalaryMoney?: string | null
  benefitsCsv?: string | null
  extrasCsv?: string | null
}

export function GetJobPostByIdAction(jobRepo: JobPostRepository) {
  return async (
    req: GetJobPostByIdRequest
  ): Promise<GetJobPostByIdResponse> => {
    const id = Id.createFrom(req.id)
    const found = await jobRepo.findById(id)
    if (!found) {
      throw new NotFoundError('Job post not found')
    }

    return {
      id: found.id.toString(),
      companyId: found.companyId.toString(),
      title: found.title.toString(),
      location: found.location.toString(),
      description: found.description.toString(),
      contractType: found.contractType.toString(),
      minSalaryMoney: found.minSalary?.toString() ?? null,
      maxSalaryMoney: found.maxSalary?.toString() ?? null,
      benefitsCsv: found.benefitsCsv,
      extrasCsv: found.extrasCsv,
    }
  }
}
