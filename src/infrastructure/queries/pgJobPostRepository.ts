import {
  type JobPostRepository,
  type JobPostSearchParams,
} from '../../core/repositories/jobPostRepository'
import { JobPost } from '../../core/entities/jobPost'
import { Id } from '../../core/valueObjects/id'
import { Money } from '../../core/valueObjects/money'
import { withPgClient } from './pgQueryExecutor'
import { type QueryConfig } from 'pg'
import { JobTitle } from '../../core/valueObjects/jobPost/jobTitle'
import { JobLocation } from '../../core/valueObjects/jobPost/jobLocation'
import { JobDescription } from '../../core/valueObjects/jobPost/jobDescription'
import { ContractType } from '../../core/valueObjects/jobPost/contractType'

function csvToArray(csv: string | null | undefined): string[] | null {
  if (!csv) return null
  const list = csv
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  return list.length > 0 ? list : null
}

function arrayToCsv(arr: string[] | null | undefined): string | null {
  if (!arr || arr.length === 0) return null
  return arr.join(', ')
}

function buildOrderBy(orderRules?: string[] | null): string {
  const rules =
    orderRules && orderRules.length > 0
      ? orderRules
      : ['recent', 'salary', 'company_posts']
  const parts: string[] = []
  for (const r of rules) {
    if (r === 'recent') {
      // rank recent (last 7 days) first, then by created_at desc
      parts.push(
        `(CASE WHEN jp.created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) DESC`
      )
      parts.push(`jp.created_at DESC`)
    } else if (r === 'salary') {
      // prefer higher of available max/min salary numeric part
      parts.push(`COALESCE(NULLIF(split_part(jp.max_salary_money, ' ', 1), '')::numeric,
                           NULLIF(split_part(jp.min_salary_money, ' ', 1), '')::numeric, 0) DESC`)
    } else if (r === 'company_posts') {
      parts.push(`company_post_count DESC`)
    }
  }
  return parts.length > 0 ? `ORDER BY ${parts.join(', ')}` : ''
}

export class PostgresJobPostRepository implements JobPostRepository {
  async create(jobPost: JobPost): Promise<JobPost | null> {
    return await withPgClient(async (pgClient) => {
      const benefitsArr = csvToArray(jobPost.benefitsCsv)
      const extrasArr = csvToArray(jobPost.extrasCsv)
      const queryConfig: QueryConfig = {
        text: `INSERT INTO job_posts (
                 id, company_id, title, location, description, contract_type,
                 min_salary_money, max_salary_money, benefits, extras
               ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        values: [
          jobPost.id.toString(),
          jobPost.companyId.toString(),
          jobPost.title.toString(),
          jobPost.location.toString(),
          jobPost.description.toString(),
          jobPost.contractType.toString(),
          jobPost.minSalary ? jobPost.minSalary.toString() : null,
          jobPost.maxSalary ? jobPost.maxSalary.toString() : null,
          benefitsArr,
          extrasArr,
        ],
      }

      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0
        ? PostgresJobPostRepository.mapToJobPost(rows[0])
        : null
    })
  }

  async findById(id: Id): Promise<JobPost | null> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `SELECT * FROM job_posts WHERE id = $1 LIMIT 1`,
        values: [id.toString()],
      }
      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0
        ? PostgresJobPostRepository.mapToJobPost(rows[0])
        : null
    })
  }

  async update(jobPost: JobPost): Promise<JobPost | null> {
    return await withPgClient(async (pgClient) => {
      const benefitsArr = csvToArray(jobPost.benefitsCsv)
      const extrasArr = csvToArray(jobPost.extrasCsv)
      const queryConfig: QueryConfig = {
        text: `UPDATE job_posts SET
                 company_id = $2,
                 title = $3,
                 location = $4,
                 description = $5,
                 contract_type = $6,
                 min_salary_money = $7,
                 max_salary_money = $8,
                 benefits = $9,
                 extras = $10,
                 updated_at = NOW()
               WHERE id = $1 RETURNING *`,
        values: [
          jobPost.id.toString(),
          jobPost.companyId.toString(),
          jobPost.title.toString(),
          jobPost.location.toString(),
          jobPost.description.toString(),
          jobPost.contractType.toString(),
          jobPost.minSalary ? jobPost.minSalary.toString() : null,
          jobPost.maxSalary ? jobPost.maxSalary.toString() : null,
          benefitsArr,
          extrasArr,
        ],
      }
      const { rows } = await pgClient.query(queryConfig)
      return rows.length > 0
        ? PostgresJobPostRepository.mapToJobPost(rows[0])
        : null
    })
  }

  async delete(id: Id): Promise<boolean> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: `DELETE FROM job_posts WHERE id = $1`,
        values: [id.toString()],
      }
      const result = await pgClient.query(queryConfig)
      return result.rowCount > 0
    })
  }

  async search(params: JobPostSearchParams): Promise<JobPost[]> {
    return await withPgClient(async (pgClient) => {
      const where: string[] = []
      const values: any[] = []

      if (params.title) {
        values.push(`%${params.title.trim()}%`)
        where.push(`jp.title ILIKE $${values.length}`)
      }
      if (params.location) {
        values.push(`%${params.location.trim()}%`)
        where.push(`jp.location ILIKE $${values.length}`)
      }
      if (params.minSalaryAmount != null) {
        values.push(params.minSalaryAmount)
        where.push(
          `COALESCE(NULLIF(split_part(jp.min_salary_money, ' ', 1), '')::numeric, 0) >= $${values.length}`
        )
      }
      if (params.maxSalaryAmount != null) {
        values.push(params.maxSalaryAmount)
        // Allow any job where max or min is <= filter max
        where.push(`COALESCE(NULLIF(split_part(jp.max_salary_money, ' ', 1), '')::numeric,
                               NULLIF(split_part(jp.min_salary_money, ' ', 1), '')::numeric, 0) <= $${values.length}`)
      }

      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
      const orderSql = buildOrderBy(params.orderRules)

      const limit = params.limit && params.limit > 0 ? params.limit : 50
      const offset = params.offset && params.offset >= 0 ? params.offset : 0
      values.push(limit)
      values.push(offset)

      const text = `
        WITH counts AS (
          SELECT company_id, COUNT(*) AS company_post_count
          FROM job_posts
          GROUP BY company_id
        )
        SELECT jp.*,
               COALESCE(c.company_post_count, 0) AS company_post_count
        FROM job_posts jp
        LEFT JOIN counts c ON c.company_id = jp.company_id
        ${whereSql}
        ${orderSql}
        LIMIT $${values.length - 1} OFFSET $${values.length}
      `

      const queryConfig: QueryConfig = { text, values }
      const { rows } = await pgClient.query(queryConfig)
      return rows.map((r: any) => PostgresJobPostRepository.mapToJobPost(r))
    })
  }

  private static mapToJobPost(row: any): JobPost {
    const minSalary = row.min_salary_money
      ? Money.createFromString(row.min_salary_money)
      : null
    const maxSalary = row.max_salary_money
      ? Money.createFromString(row.max_salary_money)
      : null

    // DB arrays to csv for domain
    const benefitsCsv = arrayToCsv(row.benefits as string[] | null)
    const extrasCsv = arrayToCsv(row.extras as string[] | null)

    return new JobPost(
      Id.createFrom(row.id),
      Id.createFrom(row.company_id),
      JobTitle.create(row.title),
      JobLocation.create(row.location),
      JobDescription.create(row.description),
      ContractType.create(row.contract_type),
      minSalary,
      maxSalary,
      benefitsCsv,
      extrasCsv
    )
  }
}
