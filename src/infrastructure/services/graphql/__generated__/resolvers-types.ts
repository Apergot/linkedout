import { type GraphQLResolveInfo } from 'graphql'
import { type MyContext } from '../../../../index'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<T extends Record<string, unknown>, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

/** Standard mutation response for adding a Book. */
export interface AddBookMutationResponse {
  __typename?: 'AddBookMutationResponse'
  book?: Maybe<Book>
  code: Scalars['String']['output']
  message: Scalars['String']['output']
  success: Scalars['Boolean']['output']
}

/** Represents a book in the demo section. */
export interface Book {
  __typename?: 'Book'
  author?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

/** Represents a Company. For now, only name is exposed. */
export interface Company {
  __typename?: 'Company'
  name?: Maybe<Scalars['String']['output']>
}

/** Response returned by createCompany mutation. */
export interface CreateCompanyResponse {
  __typename?: 'CreateCompanyResponse'
  code: Scalars['String']['output']
  company?: Maybe<Company>
  message: Scalars['String']['output']
  success: Scalars['Boolean']['output']
}

export interface CreateJobPostInput {
  benefitsCsv?: InputMaybe<Scalars['String']['input']>
  companyId: Scalars['ID']['input']
  contractType: Scalars['String']['input']
  description: Scalars['String']['input']
  extrasCsv?: InputMaybe<Scalars['String']['input']>
  location: Scalars['String']['input']
  maxSalaryAmount?: InputMaybe<Scalars['Float']['input']>
  maxSalaryCurrency?: InputMaybe<Scalars['String']['input']>
  minSalaryAmount?: InputMaybe<Scalars['Float']['input']>
  minSalaryCurrency?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
}

/** Response returned by deleteJobPost mutation. */
export interface DeleteJobPostResponse {
  __typename?: 'DeleteJobPostResponse'
  code: Scalars['String']['output']
  deleted?: Maybe<Scalars['Boolean']['output']>
  id?: Maybe<Scalars['ID']['output']>
  message: Scalars['String']['output']
  success: Scalars['Boolean']['output']
}

/**
 * Represents a job post entity.
 * Salary fields are formatted as strings like "100 USD".
 * Benefits and extras are stored as comma-separated strings.
 */
export interface JobPost {
  __typename?: 'JobPost'
  benefitsCsv?: Maybe<Scalars['String']['output']>
  companyId: Scalars['ID']['output']
  contractType: Scalars['String']['output']
  description: Scalars['String']['output']
  extrasCsv?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  location: Scalars['String']['output']
  maxSalaryMoney?: Maybe<Scalars['String']['output']>
  minSalaryMoney?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
}

/** Response returned by JobPost create/update/get queries. */
export interface JobPostResponse {
  __typename?: 'JobPostResponse'
  code: Scalars['String']['output']
  jobPost?: Maybe<JobPost>
  message: Scalars['String']['output']
  success: Scalars['Boolean']['output']
}

export interface Mutation {
  __typename?: 'Mutation'
  addBook?: Maybe<AddBookMutationResponse>
  createCompany?: Maybe<CreateCompanyResponse>
  createJobPost?: Maybe<JobPostResponse>
  deleteJobPost?: Maybe<DeleteJobPostResponse>
  updateJobPost?: Maybe<JobPostResponse>
}

export interface MutationAddBookArgs {
  author?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

export interface MutationCreateCompanyArgs {
  name?: InputMaybe<Scalars['String']['input']>
}

export interface MutationCreateJobPostArgs {
  input: CreateJobPostInput
}

export interface MutationDeleteJobPostArgs {
  id: Scalars['ID']['input']
}

export interface MutationUpdateJobPostArgs {
  input: UpdateJobPostInput
}

export interface Query {
  __typename?: 'Query'
  books?: Maybe<Array<Maybe<Book>>>
  jobPost?: Maybe<JobPostResponse>
}

export interface QueryJobPostArgs {
  id: Scalars['ID']['input']
}

export interface UpdateJobPostInput {
  benefitsCsv?: InputMaybe<Scalars['String']['input']>
  companyId: Scalars['ID']['input']
  contractType: Scalars['String']['input']
  description: Scalars['String']['input']
  extrasCsv?: InputMaybe<Scalars['String']['input']>
  id: Scalars['ID']['input']
  location: Scalars['String']['input']
  maxSalaryAmount?: InputMaybe<Scalars['Float']['input']>
  maxSalaryCurrency?: InputMaybe<Scalars['String']['input']>
  minSalaryAmount?: InputMaybe<Scalars['Float']['input']>
  minSalaryCurrency?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export interface ResolverWithResolve<TResult, TParent, TContext, TArgs> {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddBookMutationResponse: ResolverTypeWrapper<AddBookMutationResponse>
  Book: ResolverTypeWrapper<Book>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Company: ResolverTypeWrapper<Company>
  CreateCompanyResponse: ResolverTypeWrapper<CreateCompanyResponse>
  CreateJobPostInput: CreateJobPostInput
  DeleteJobPostResponse: ResolverTypeWrapper<DeleteJobPostResponse>
  Float: ResolverTypeWrapper<Scalars['Float']['output']>
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  JobPost: ResolverTypeWrapper<JobPost>
  JobPostResponse: ResolverTypeWrapper<JobPostResponse>
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  UpdateJobPostInput: UpdateJobPostInput
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddBookMutationResponse: AddBookMutationResponse
  Book: Book
  Boolean: Scalars['Boolean']['output']
  Company: Company
  CreateCompanyResponse: CreateCompanyResponse
  CreateJobPostInput: CreateJobPostInput
  DeleteJobPostResponse: DeleteJobPostResponse
  Float: Scalars['Float']['output']
  ID: Scalars['ID']['output']
  JobPost: JobPost
  JobPostResponse: JobPostResponse
  Mutation: Record<PropertyKey, never>
  Query: Record<PropertyKey, never>
  String: Scalars['String']['output']
  UpdateJobPostInput: UpdateJobPostInput
}>

export type AddBookMutationResponseResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['AddBookMutationResponse'] = ResolversParentTypes['AddBookMutationResponse'],
> = ResolversObject<{
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType>
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
}>

export type BookResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['Book'] = ResolversParentTypes['Book'],
> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}>

export type CompanyResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['Company'] = ResolversParentTypes['Company'],
> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}>

export type CreateCompanyResponseResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['CreateCompanyResponse'] = ResolversParentTypes['CreateCompanyResponse'],
> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
}>

export type DeleteJobPostResponseResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['DeleteJobPostResponse'] = ResolversParentTypes['DeleteJobPostResponse'],
> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
}>

export type JobPostResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['JobPost'] = ResolversParentTypes['JobPost'],
> = ResolversObject<{
  benefitsCsv?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  companyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  contractType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  extrasCsv?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  maxSalaryMoney?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  minSalaryMoney?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type JobPostResponseResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['JobPostResponse'] = ResolversParentTypes['JobPostResponse'],
> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  jobPost?: Resolver<Maybe<ResolversTypes['JobPost']>, ParentType, ContextType>
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
}>

export type MutationResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  addBook?: Resolver<
    Maybe<ResolversTypes['AddBookMutationResponse']>,
    ParentType,
    ContextType,
    Partial<MutationAddBookArgs>
  >
  createCompany?: Resolver<
    Maybe<ResolversTypes['CreateCompanyResponse']>,
    ParentType,
    ContextType,
    Partial<MutationCreateCompanyArgs>
  >
  createJobPost?: Resolver<
    Maybe<ResolversTypes['JobPostResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateJobPostArgs, 'input'>
  >
  deleteJobPost?: Resolver<
    Maybe<ResolversTypes['DeleteJobPostResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteJobPostArgs, 'id'>
  >
  updateJobPost?: Resolver<
    Maybe<ResolversTypes['JobPostResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateJobPostArgs, 'input'>
  >
}>

export type QueryResolvers<
  ContextType = MyContext,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  books?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Book']>>>,
    ParentType,
    ContextType
  >
  jobPost?: Resolver<
    Maybe<ResolversTypes['JobPostResponse']>,
    ParentType,
    ContextType,
    RequireFields<QueryJobPostArgs, 'id'>
  >
}>

export type Resolvers<ContextType = MyContext> = ResolversObject<{
  AddBookMutationResponse?: AddBookMutationResponseResolvers<ContextType>
  Book?: BookResolvers<ContextType>
  Company?: CompanyResolvers<ContextType>
  CreateCompanyResponse?: CreateCompanyResponseResolvers<ContextType>
  DeleteJobPostResponse?: DeleteJobPostResponseResolvers<ContextType>
  JobPost?: JobPostResolvers<ContextType>
  JobPostResponse?: JobPostResponseResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
}>
