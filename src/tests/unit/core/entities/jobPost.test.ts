import { JobPost } from '../../../../core/entities/jobPost'
import { Id } from '../../../../core/valueObjects/id'
import { JobTitle } from '../../../../core/valueObjects/jobPost/jobTitle'
import { JobLocation } from '../../../../core/valueObjects/jobPost/jobLocation'
import { JobDescription } from '../../../../core/valueObjects/jobPost/jobDescription'
import { ContractType } from '../../../../core/valueObjects/jobPost/contractType'
import { Money } from '../../../../core/valueObjects/money'
import { ValidationError } from '../../../../core/common/error'

describe('The JobPost Entity', () => {
  const base = () => ({
    id: Id.generateUniqueId(),
    companyId: Id.generateUniqueId(),
    title: JobTitle.create('Backend Engineer'),
    location: JobLocation.create('Remote'),
    description: JobDescription.create('APIs'),
    type: ContractType.create('FULL_TIME'),
  })

  it('throws ValidationError when min/max salary currencies differ', () => {
    const ctx = base()
    const min = Money.create(100, 'USD')
    const max = Money.create(200, 'EUR')

    expect(
      () =>
        new JobPost(
          ctx.id,
          ctx.companyId,
          ctx.title,
          ctx.location,
          ctx.description,
          ctx.type,
          min,
          max
        )
    ).toThrow(ValidationError)
  })

  it('allows same currency or single bound', () => {
    const ctx = base()
    const min = Money.create(100, 'USD')
    const max = Money.create(200, 'USD')

    const both = new JobPost(
      ctx.id,
      ctx.companyId,
      ctx.title,
      ctx.location,
      ctx.description,
      ctx.type,
      min,
      max
    )
    expect(both.minSalary?.getCurrency()).toBe('USD')

    const onlyMin = new JobPost(
      ctx.id,
      ctx.companyId,
      ctx.title,
      ctx.location,
      ctx.description,
      ctx.type,
      min,
      null
    )
    expect(onlyMin.hasSalaryRange()).toBe(true)
  })

  it('parses benefits/extras csv correctly', () => {
    const ctx = base()
    const jp = new JobPost(
      ctx.id,
      ctx.companyId,
      ctx.title,
      ctx.location,
      ctx.description,
      ctx.type,
      null,
      null,
      'gym, cafeteria, snacks',
      'home office, stipend'
    )

    expect(jp.benefitsAsList()).toEqual(['gym', 'cafeteria', 'snacks'])
    expect(jp.extrasAsList()).toEqual(['home office', 'stipend'])
  })
})
