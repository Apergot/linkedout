import { type User } from '../entities/user'
import { type Email } from '../valueObjects/email'
import { type Id } from '../valueObjects/id'

export interface UserRepository {
  create: (user: User) => Promise<User | null>
  findByEmail: (email: Email) => Promise<User | null>
  findById: (id: Id) => Promise<User | null>
  setCompanyId: (id: Id, companyId: Id) => Promise<User | null>
}
