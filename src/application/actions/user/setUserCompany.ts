import { type UserRepository } from '../../../core/repositories/userRepository'
import { Id } from '../../../core/valueObjects/id'
import { NotFoundError } from '../../../core/common/error'

export interface SetUserCompanyRequest {
  userId: string
  companyId: string
}

export interface SetUserCompanyResponse {
  id: string
  email: string
  companyId: string
}

export function SetUserCompanyAction(userRepo: UserRepository) {
  return async (
    req: SetUserCompanyRequest
  ): Promise<SetUserCompanyResponse> => {
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
