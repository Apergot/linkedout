import { ValidationError } from '../../common/error'

export class JobDescription {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): JobDescription {
    const trimmed = (value ?? '').trim()
    if (!trimmed) {
      throw new ValidationError('Job description must be a non-empty string')
    }
    if (trimmed.length > 5000) {
      throw new ValidationError(
        'Job description must be at most 5000 characters'
      )
    }
    return new JobDescription(trimmed)
  }

  toString(): string {
    return this.value
  }

  isEqual(other: JobDescription): boolean {
    return this.value === other.value
  }
}
