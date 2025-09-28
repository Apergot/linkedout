import { type UserRepository } from '../../../core/repositories/userRepository'
import { Id } from '../../../core/valueObjects/id'
import { NotFoundError } from '../../../core/common/error'

export interface SetMyCompanyRequest {
  userId: string
  companyId: string
}

export interface SetMyCompanyResponse {
  id: string
  email: string
  companyId: string
}

export function SetMyCompanyAction(userRepo: UserRepository) {
  return async (req: SetMyCompanyRequest): Promise<SetMyCompanyResponse> => {
    const userId = Id.createFrom(req.userId)
    const companyId = Id.createFrom(req.companyId)

    const updated = await userRepo.setCompanyId(userId, companyId)
    if (!updated) throw new NotFoundError('User not found')

    return {
      id: updated.id.toString(),
      email: updated.email.toString(),
      companyId: companyId.toString(),
    }
  }
}
