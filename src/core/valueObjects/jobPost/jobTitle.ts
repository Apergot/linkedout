import { ValidationError } from '../../common/error'

export class JobTitle {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): JobTitle {
    const trimmed = (value ?? '').trim()
    if (!trimmed) {
      throw new ValidationError('Job title must be a non-empty string')
    }
    if (trimmed.length > 120) {
      throw new ValidationError('Job title must be at most 120 characters')
    }
    return new JobTitle(trimmed)
  }

  toString(): string {
    return this.value
  }

  isEqual(other: JobTitle): boolean {
    return this.value === other.value
  }
}
