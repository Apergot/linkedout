import { ValidationError } from '../common/error'

export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    const trimmed = (value ?? '').trim().toLowerCase()
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(trimmed)) {
      throw new ValidationError('Invalid email format')
    }
    return new Email(trimmed)
  }

  toString(): string {
    return this.value
  }

  isEqual(other: Email): boolean {
    return this.value === other.value
  }
}
