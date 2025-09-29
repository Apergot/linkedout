import { type UserRepository } from '../../../core/repositories/userRepository'
import { Id } from '../../../core/valueObjects/id'
import { NotFoundError } from '../../../core/common/error'

export interface GetUserByIdRequest {
  id: string
}

export interface GetUserByIdResponse {
  id: string
  email: string
  companyId: string | null
}

export function GetUserByIdAction(userRepo: UserRepository) {
  return async (req: GetUserByIdRequest): Promise<GetUserByIdResponse> => {
    const id = Id.createFrom(req.id)
    const user = await userRepo.findById(id)
    if (!user) throw new NotFoundError('User not found')
    return {
      id: user.id.toString(),
      email: user.email.toString(),
      companyId: user.companyId ? user.companyId.toString() : null,
    }
  }
}
