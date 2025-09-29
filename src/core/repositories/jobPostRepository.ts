import { type JobPost } from '../entities/jobPost'
import { type Id } from '../valueObjects/id'

export interface JobPostSearchParams {
  title?: string | null
  location?: string | null
  minSalaryAmount?: number | null
  maxSalaryAmount?: number | null
  limit?: number | null
  offset?: number | null
  orderRules?: string[] | null // e.g., ['recent','salary','company_posts'] in precedence order
}

export interface JobPostRepository {
  create: (jobPost: JobPost) => Promise<JobPost | null>
  findById: (id: Id) => Promise<JobPost | null>
  update: (jobPost: JobPost) => Promise<JobPost | null>
  delete: (id: Id) => Promise<boolean>
  search: (params: JobPostSearchParams) => Promise<JobPost[]>
}
