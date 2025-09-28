import { type UserRepository } from '../../../core/repositories/userRepository'
import { Email } from '../../../core/valueObjects/email'
import { UnauthorizedError } from '../../../core/common/error'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../../config'

export interface LoginUserRequest {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
  email: string
  token: string
}

export function LoginUserAction(userRepo: UserRepository) {
  return async (req: LoginUserRequest): Promise<AuthResponse> => {
    const email = Email.create(req.email)
    const user = await userRepo.findByEmail(email)
    if (!user) throw new UnauthorizedError('Invalid credentials')

    const ok = await bcrypt.compare(req.password ?? '', user.passwordHash)
    if (!ok) throw new UnauthorizedError('Invalid credentials')

    const token = jwt.sign(
      {
        userId: user.id.toString(),
        email: user.email.toString(),
        companyId: user.companyId ? user.companyId.toString() : null,
      },
      config.jwtSecret(),
      {
        expiresIn: '7d',
      }
    )

    return { id: user.id.toString(), email: user.email.toString(), token }
  }
}
