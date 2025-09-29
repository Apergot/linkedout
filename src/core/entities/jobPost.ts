import { type Id } from '../valueObjects/id'
import { type Money } from '../valueObjects/money'
import { type JobTitle } from '../valueObjects/jobPost/jobTitle'
import { type JobLocation } from '../valueObjects/jobPost/jobLocation'
import { type JobDescription } from '../valueObjects/jobPost/jobDescription'
import { type ContractType } from '../valueObjects/jobPost/contractType'
import { ValidationError } from '../common/error'

export interface JobPostDTO {
  id: string
  companyId: string
  title: string
  location: string
  description: string
  contractType: string
  minSalaryMoney?: string | null
  maxSalaryMoney?: string | null
  benefitsCsv?: string | null
  extrasCsv?: string | null
}

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

  toDto(): JobPostDTO {
    return {
      id: this.id.toString(),
      companyId: this.companyId.toString(),
      title: this.title.toString(),
      location: this.location.toString(),
      description: this.description.toString(),
      contractType: this.contractType.toString(),
      minSalaryMoney: this.minSalary?.toString() ?? null,
      maxSalaryMoney: this.maxSalary?.toString() ?? null,
      benefitsCsv: this.benefitsCsv ?? null,
      extrasCsv: this.extrasCsv ?? null,
    }
  }
}
