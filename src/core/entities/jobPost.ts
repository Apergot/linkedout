import { type Id } from '../valueObjects/id'
import { type Money } from '../valueObjects/money'
import { type JobTitle } from '../valueObjects/jobPost/jobTitle'
import { type JobLocation } from '../valueObjects/jobPost/jobLocation'
import { type JobDescription } from '../valueObjects/jobPost/jobDescription'
import { type ContractType } from '../valueObjects/jobPost/contractType'
import { ValidationError } from '../common/error'

export class JobPost {
  constructor(
    public readonly id: Id,
    public readonly companyId: Id,
    public readonly title: JobTitle,
    public readonly location: JobLocation,
    public readonly description: JobDescription,
    public readonly contractType: ContractType,
    public readonly minSalary: Money | null = null,
    public readonly maxSalary: Money | null = null,
    public readonly benefitsCsv: string | null = null,
    public readonly extrasCsv: string | null = null
  ) {
    if (this.minSalary && this.maxSalary) {
      if (this.minSalary.getCurrency() !== this.maxSalary.getCurrency()) {
        throw new ValidationError(
          'minSalary and maxSalary must have the same currency'
        )
      }
    }
  }

  benefitsAsList(): string[] {
    return JobPost.csvToList(this.benefitsCsv)
  }

  extrasAsList(): string[] {
    return JobPost.csvToList(this.extrasCsv)
  }

  hasSalaryRange(): boolean {
    return this.minSalary !== null || this.maxSalary !== null
  }

  static csvToList(value: string | null | undefined): string[] {
    if (!value) return []
    return value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }
}
