import { type JobPostRepository } from '../../../core/repositories/jobPostRepository'
import { Id } from '../../../core/valueObjects/id'
import { NotFoundError } from '../../../core/common/error'

export interface DeleteJobPostRequest {
  id: string
}

export interface DeleteJobPostResponse {
  id: string
  deleted: boolean
}

export function DeleteJobPostAction(jobRepo: JobPostRepository) {
  return async (req: DeleteJobPostRequest): Promise<DeleteJobPostResponse> => {
    const id = Id.createFrom(req.id)
    const existed = await jobRepo.findById(id)
    if (!existed) {
      throw new NotFoundError('Job post not found')
    }

    const ok = await jobRepo.delete(id)
    return { id: req.id, deleted: ok }
  }
}
