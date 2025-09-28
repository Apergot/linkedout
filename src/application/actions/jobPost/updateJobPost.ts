import { type JobPostRepository } from '../../../core/repositories/jobPostRepository'
import { Id } from '../../../core/valueObjects/id'
import { JobTitle } from '../../../core/valueObjects/jobPost/jobTitle'
import { JobLocation } from '../../../core/valueObjects/jobPost/jobLocation'
import { JobDescription } from '../../../core/valueObjects/jobPost/jobDescription'
import { ContractType } from '../../../core/valueObjects/jobPost/contractType'
import { Money } from '../../../core/valueObjects/money'
import { NotFoundError, ValidationError } from '../../../core/common/error'
import { JobPost } from '../../../core/entities/jobPost'

export interface UpdateJobPostRequest {
  id: string
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

export interface UpdateJobPostResponse {
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

export function UpdateJobPostAction(jobRepo: JobPostRepository) {
  return async (req: UpdateJobPostRequest): Promise<UpdateJobPostResponse> => {
    const existing = await jobRepo.findById(Id.createFrom(req.id))
    if (!existing) {
      throw new NotFoundError('Job post not found')
    }

    if (existing.companyId.toString() !== req.companyId) {
      throw new ValidationError(
        'Cannot change companyId of an existing job post'
      )
    }

    const id = Id.createFrom(req.id)
    const companyId = existing.companyId
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

    const updated = await jobRepo.update(
      new JobPost(
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
    )

    if (!updated) {
      throw new NotFoundError('Job post not found')
    }

    return {
      id: updated.id.toString(),
      companyId: updated.companyId.toString(),
      title: updated.title.toString(),
      location: updated.location.toString(),
      description: updated.description.toString(),
      contractType: updated.contractType.toString(),
      minSalaryMoney: updated.minSalary?.toString() ?? null,
      maxSalaryMoney: updated.maxSalary?.toString() ?? null,
      benefitsCsv: updated.benefitsCsv,
      extrasCsv: updated.extrasCsv,
    }
  }
}
