import { type JobPostRepository } from '../../../core/repositories/jobPostRepository'
import { Id } from '../../../core/valueObjects/id'
import { JobTitle } from '../../../core/valueObjects/jobPost/jobTitle'
import { JobLocation } from '../../../core/valueObjects/jobPost/jobLocation'
import { JobDescription } from '../../../core/valueObjects/jobPost/jobDescription'
import { ContractType } from '../../../core/valueObjects/jobPost/contractType'
import { Money } from '../../../core/valueObjects/money'
import { JobPost } from '../../../core/entities/jobPost'
import { InternalServerError } from '../../../core/common/error'

export interface CreateJobPostRequest {
  companyId: string
  title: string
  location: string
  description: string
  contractType: string
  minSalaryAmount?: number | null
  minSalaryCurrency?: string | null
  maxSalaryAmount?: number | null
  maxSalaryCurrency?: string | null
  benefitsCsv?: string | null
  extrasCsv?: string | null
}

export interface CreateJobPostResponse {
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

export function CreateJobPostAction(jobRepo: JobPostRepository) {
  return async (req: CreateJobPostRequest): Promise<CreateJobPostResponse> => {
    const id = Id.generateUniqueId()
    const companyId = Id.createFrom(req.companyId)
    const title = JobTitle.create(req.title)
    const location = JobLocation.create(req.location)
    const description = JobDescription.create(req.description)
    const contractType = ContractType.create(req.contractType)

    const minSalary =
      req.minSalaryAmount && req.minSalaryCurrency
        ? Money.create(req.minSalaryAmount, req.minSalaryCurrency)
        : null
    const maxSalary =
      req.maxSalaryAmount && req.maxSalaryCurrency
        ? Money.create(req.maxSalaryAmount, req.maxSalaryCurrency)
        : null

    const job = new JobPost(
      id,
      companyId,
      title,
      location,
      description,
      contractType,
      minSalary,
      maxSalary,
      req.benefitsCsv ?? null,
      req.extrasCsv ?? null
    )

    const created = await jobRepo.create(job)
    if (!created) {
      throw new InternalServerError('Unable to create job post')
    }

    return {
      id: created.id.toString(),
      companyId: created.companyId.toString(),
      title: created.title.toString(),
      location: created.location.toString(),
      description: created.description.toString(),
      contractType: created.contractType.toString(),
      minSalaryMoney: created.minSalary?.toString() ?? null,
      maxSalaryMoney: created.maxSalary?.toString() ?? null,
      benefitsCsv: created.benefitsCsv,
      extrasCsv: created.extrasCsv,
    }
  }
}
