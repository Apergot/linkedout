import { ValidationError } from '../../common/error'

export class JobLocation {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): JobLocation {
    const trimmed = (value ?? '').trim()
    if (!trimmed) {
      throw new ValidationError('Job location must be a non-empty string')
    }
    if (trimmed.length > 120) {
      throw new ValidationError('Job location must be at most 120 characters')
    }
    return new JobLocation(trimmed)
  }

  toString(): string {
    return this.value
  }

  isEqual(other: JobLocation): boolean {
    return this.value === other.value
  }
}
