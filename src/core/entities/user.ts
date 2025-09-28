import { type Id } from '../valueObjects/id'
import { type Email } from '../valueObjects/email'

export class User {
  constructor(
    public readonly id: Id,
    public readonly email: Email,
    public readonly passwordHash: string,
    public readonly companyId: Id | null = null
  ) {}
}
