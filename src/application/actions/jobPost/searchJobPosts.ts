import {
  type JobPostRepository,
  type JobPostSearchParams,
} from '../../../core/repositories/jobPostRepository'
import { type JobPostDTO } from '../../../core/entities/jobPost'

export interface JobPostSearchRequest {
  title?: string | null
  location?: string | null
  minSalaryAmount?: number | null
  maxSalaryAmount?: number | null
  limit?: number | null
  offset?: number | null
}

export interface JobPostSearchResponse {
  items: JobPostDTO[]
}

export function SearchJobPostsAction(jobRepo: JobPostRepository) {
  return async (req: JobPostSearchRequest): Promise<JobPostSearchResponse> => {
    const params: JobPostSearchParams = {
      title: req.title ?? null,
      location: req.location ?? null,
      minSalaryAmount: req.minSalaryAmount ?? null,
      maxSalaryAmount: req.maxSalaryAmount ?? null,
      limit: req.limit ?? 50,
      offset: req.offset ?? 0,
      orderRules: ['recent', 'salary', 'company_posts'],
    }

    const results = await jobRepo.search(params)

    const items: JobPostDTO[] = results.map((jobPost) => jobPost.toDto())

    return { items }
  }
}
