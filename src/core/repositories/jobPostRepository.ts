import { type JobPost } from '../entities/jobPost'
import { type Id } from '../valueObjects/id'

export interface JobPostRepository {
  create: (jobPost: JobPost) => Promise<JobPost | null>
  findById: (id: Id) => Promise<JobPost | null>
  update: (jobPost: JobPost) => Promise<JobPost | null>
  delete: (id: Id) => Promise<boolean>
}
