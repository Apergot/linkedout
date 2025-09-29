# LinkedOut API

A friendly GraphQL API (Apollo Server) for a lean jobs platform. It follows a clean, layered architecture (domain entities and value objects, application actions/services, infrastructure repositories) and ships with:
- JWT auth for end‑users (signup/login)
- Superadmin API token for privileged admin ops
- Job post CRUD with authorization by company
- Powerful search with ranking rules and filters

## Table of contents
- Features
- Architecture overview
- Getting started
  - Prerequisites
  - Environment configuration (docker.env)
  - Run with Docker
  - Database migrations
  - Run without Docker (local Node)
- Authentication
  - End-user (JWT)
  - Superadmin (X-API-KEY)
- GraphQL schema and examples
  - Signup/Login
  - Admin-only: createCompany, setUserCompany
  - JobPost CRUD (create, get, update, delete)
  - JobPost search with ranking + filters
- Configuration reference (.env / docker.env)
- Troubleshooting
- Development tips

---

## Features
- Users
  - Signup and login using email/password
  - JWT issued on success (7 days expiration)
  - setUserCompany is superadmin-only (via API token)
  - Two types of user, employer and employee, the only difference between them is that the companyId must be set at user entity to be considered an employer, which needs to be done as a superadmin user.
- Companies
  - createCompany is superadmin-only
  - Validation: unique company name, proper name format
- Job posts
  - CRUD operations protected by JWT
  - Ownership: users can only create/update/delete posts for their own company
  - Salary rule: minSalary and maxSalary must share the same currency
  - Benefits/Extras as comma-separated values
- Search and ranking rules
  - Filters: title, location, salary ranges (min/max)
  - Ranking precedence:
    1) Posts created in the last 7 days rank above older posts
    2) Higher salaries rank above lower salaries
    3) Companies with more open job posts rank higher
  - Rules can be re-ordered or extended easily

## Use cases (what you can do)
- As a employee, search job posts and refine by title, location, or salary range, always seeing fresh and well‑paid roles first.
- As a employee (JWT user), manage job posts for your own company: create, update (without changing company), and delete.
- As a superadmin (API token), create companies and assign users to companies (setUserCompany) to bootstrap organizations.

## Architecture overview
- Domain (core/): Entities (Company, JobPost, User), Value Objects (Id, Name, Money, JobTitle, JobLocation, JobDescription, ContractType), and domain errors
- Application (application/): Actions encapsulate use cases; Services expose actions to upper layers
- Infrastructure (infrastructure/):
  - Repositories: Postgres implementations (pgCompanyRepository, pgJobPostRepository, pgUserRepository)
  - GraphQL: Apollo resolvers split by domain and a contextBuilder for auth; codegen for resolver types
  - Factory singleton to build repositories, services, and Apollo server
- Database: Knex migrations under migrations/

## Getting started

### Prerequisites
- Docker Desktop (or Docker Engine + docker-compose)
- Node.js 20+ if you plan to run locally without Docker

### Environment configuration
1) Copy the distributed env file:
   - `cp docker.env.dist docker.env`
2) Review docker.env and set values. The following must be present:
   - PROJECT_NAME
   - PORT (host port to expose; internally the app binds to 9003 via docker-compose mapping)
   - DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
   - JWT_SECRET (random string)
   - API_TOKEN (superadmin API token; example below)

Example API token (for local use):
```
API_TOKEN=7c9f5b2f6e9a4d8cbb1e3a7f90c1d2e34f5a6b7c8d9e0f1a2b3c4d5e6f708192
```

### Run with Docker
- Start Docker Desktop (macOS: `make open`)
- Build and run containers:
  - `make build`  # builds and starts app + postgres + execute migrations due to Dockerfile
- GraphQL server: `http://localhost:${PORT}` (e.g., if `PORT=4000`, then `http://localhost:4000`)

Notes
- docker-compose maps `${PORT}` (host) to container port `9003`. The app listens on `process.env.PORT` inside the container; `docker.env.dist` aligns these values.

## Authentication

### End-user (JWT)
- Use signup or login to get a JWT (signed with `JWT_SECRET`)
- Send it with the Authorization header:
```
Authorization: Bearer YOUR_JWT
```
- The server sets `ctx.authUser` from the token’s `userId` and `email`.

### Superadmin (API token)
- The `createCompany` and `setUserCompany` mutations require a valid API token
- Send it via header:
```
X-API-KEY: YOUR_API_TOKEN
```
- The server sets `ctx.apiTokenAuth=true` if the header matches `API_TOKEN`.

## GraphQL schema and examples
Endpoint: `http://localhost:${PORT}`

Headers
- For user-protected operations:
```json
{ "Authorization": "Bearer <JWT>" }
```
- For superadmin operations:
```json
{ "X-API-KEY": "<API_TOKEN>" }
```

### Signup
```graphql
mutation Signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    code
    success
    message
    token
    user { id email companyId }
  }
}
```

Variables
```json
{ "email": "user1@example.com", "password": "myStrongPass123" }
```

### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    code
    success
    message
    token
    user { id email companyId }
  }
}
```

### Superadmin: createCompany
```graphql
mutation CreateCompany($name: String) {
  createCompany(name: $name) {
    code
    success
    message
    company { name }
  }
}
```

Headers
```json
{ "X-API-KEY": "<API_TOKEN>" }
```
Variables
```json
{ "name": "Acme Corp" }
```

### Superadmin: setUserCompany
```graphql
mutation SetUserCompany($userId: ID!, $companyId: ID!) {
  setUserCompany(userId: $userId, companyId: $companyId) {
    code
    success
    message
    user { id email companyId }
  }
}
```

Headers
```json
{ "X-API-KEY": "<API_TOKEN>" }
```

### Create Job Post (JWT required and must match user.companyId)
```graphql
mutation CreateJobPost($input: CreateJobPostInput!) {
  createJobPost(input: $input) {
    code
    success
    message
    jobPost {
      id
      companyId
      title
      location
      description
      contractType
      minSalaryMoney
      maxSalaryMoney
      benefitsCsv
      extrasCsv
    }
  }
}
```

Variables (replace placeholders)
```json
{
  "input": {
    "companyId": "COMPANY_UUID",
    "title": "Senior Backend Engineer",
    "location": "Remote - EU",
    "description": "Build and scale APIs.",
    "contractType": "FULL_TIME",
    "minSalaryAmount": 90000,
    "minSalaryCurrency": "USD",
    "maxSalaryAmount": 120000,
    "maxSalaryCurrency": "USD",
    "benefitsCsv": "gym membership, cafeteria, snacks",
    "extrasCsv": "home office stipend"
  }
}
```

### Get Job Post
```graphql
query GetJobPost($id: ID!) {
  jobPost(id: $id) {
    code
    success
    message
    jobPost {
      id
      companyId
      title
      location
      description
      contractType
      minSalaryMoney
      maxSalaryMoney
      benefitsCsv
      extrasCsv
    }
  }
}
```

### Update Job Post (JWT + ownership; companyId immutable)
```graphql
mutation UpdateJobPost($input: UpdateJobPostInput!) {
  updateJobPost(input: $input) {
    code
    success
    message
    jobPost {
      id
      companyId
      title
      location
      description
      contractType
      minSalaryMoney
      maxSalaryMoney
      benefitsCsv
      extrasCsv
    }
  }
}
```

### Delete Job Post (JWT + ownership)
```graphql
mutation DeleteJobPost($id: ID!) {
  deleteJobPost(id: $id) {
    code
    success
    message
    id
    deleted
  }
}
```

### Search Job Posts (ranking + filters)
```graphql
query JobPosts($filter: JobPostSearchFilter, $limit: Int, $offset: Int) {
  jobPosts(filter: $filter, limit: $limit, offset: $offset) {
    code
    success
    message
    items {
      id
      companyId
      title
      location
      description
      contractType
      minSalaryMoney
      maxSalaryMoney
      benefitsCsv
      extrasCsv
    }
  }
}
```

Variables example
```json
{
  "filter": {
    "title": "backend",
    "location": "Remote",
    "minSalaryAmount": 80000,
    "maxSalaryAmount": 200000
  },
  "limit": 20,
  "offset": 0
}
```

Notes
- `contractType` must be one of: FULL_TIME, PART_TIME, CONTRACT
- If both salaries are provided, currencies must match (e.g., USD)
- `companyId` must be a valid UUID and the caller must own the same company for CRUD

## Configuration reference (.env / docker.env)
Required variables (see `src/config.ts`):
- NODE_ENV (default: local)
- PORT
- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USER
- DATABASE_PASSWORD
- DATABASE_NAME
- JWT_SECRET
- API_TOKEN

## Troubleshooting
- 401 Unauthorized: missing/invalid JWT (for user-protected ops) or missing/invalid X-API-KEY (for superadmin ops)
- 403 Forbidden: attempting to mutate job posts for another company
- 400 ValidationError: invalid UUIDs, invalid value objects (name, title, location, description, contractType, money format)
- 404 NotFound: job post or user not found
- Migrations: ensure Postgres is up and run `make migrations`
- Port conflicts: change `PORT` in docker.env and try again

## Development tips
- Generate GraphQL resolver types: `npm run generate` (uses `codegen.yml`)
- Lint: `npm run lint` and `npm run lint:fix`
- Build TS: `npm run compile`; Start dev server: `npm run start:dev`
- Factories and context:
  - Apollo server is created via `Factory.getApolloServer()`
  - GraphQL context is assembled in `infrastructure/services/graphql/contextBuilder.ts`
