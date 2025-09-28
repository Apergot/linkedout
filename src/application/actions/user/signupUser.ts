import { type UserRepository } from '../../../core/repositories/userRepository'
import { Id } from '../../../core/valueObjects/id'
import { Email } from '../../../core/valueObjects/email'
import { User } from '../../../core/entities/user'
import {
  InternalServerError,
  ValidationError,
} from '../../../core/common/error'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../../config'

export interface SignupUserRequest {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
  email: string
  token: string
}

function validatePassword(password: string) {
  const p = password ?? ''
  if (p.length < 8)
    throw new ValidationError('Password must be at least 8 characters long')
}

export function SignupUserAction(userRepo: UserRepository) {
  return async (req: SignupUserRequest): Promise<AuthResponse> => {
    const email = Email.create(req.email)
    validatePassword(req.password)

    const existing = await userRepo.findByEmail(email)
    if (existing) {
      throw new ValidationError('Unable to create user')
    }

    const id = Id.generateUniqueId()
    const passwordHash = await bcrypt.hash(req.password, 10)

    const created = await userRepo.create(
      new User(id, email, passwordHash, null)
    )
    if (!created) {
      throw new InternalServerError('Unable to create user')
    }

    const token = jwt.sign(
      {
        userId: created.id.toString(),
        email: created.email.toString(),
        companyId: created.companyId ? created.companyId.toString() : null,
      },
      config.jwtSecret(),
      {
        expiresIn: '7d',
      }
    )

    return { id: created.id.toString(), email: created.email.toString(), token }
  }
}
