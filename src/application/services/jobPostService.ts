import { type JobPostRepository } from '../../core/repositories/jobPostRepository'
import { CreateJobPostAction } from '../actions/jobPost/createJobPost'
import { GetJobPostByIdAction } from '../actions/jobPost/getJobPostById'
import { UpdateJobPostAction } from '../actions/jobPost/updateJobPost'
import { DeleteJobPostAction } from '../actions/jobPost/deleteJobPost'

export class JobPostService {
  constructor(private readonly jobPostRepository: JobPostRepository) {}

  async create() {
    return CreateJobPostAction(this.jobPostRepository)
  }

  async getById() {
    return GetJobPostByIdAction(this.jobPostRepository)
  }

  async update() {
    return UpdateJobPostAction(this.jobPostRepository)
  }

  async delete() {
    return DeleteJobPostAction(this.jobPostRepository)
  }
}
