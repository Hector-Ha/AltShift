import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token: Scalars["String"]["output"];
  user: User;
};

export type Document = {
  __typename?: "Document";
  collaborators: Array<User>;
  content: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  deletedAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  isPublic: Scalars["Boolean"]["output"];
  owner: User;
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  acceptCollaborateInvitation: Document;
  addCollaborator: Document;
  createDocument: Document;
  createUser: AuthPayload;
  declineCollaborateInvitation: Scalars["Boolean"]["output"];
  deleteDocument: Scalars["DateTime"]["output"];
  deleteUser: Scalars["DateTime"]["output"];
  login: AuthPayload;
  logout: Scalars["Boolean"]["output"];
  removeCollaborator: Document;
  updateDocument: Document;
  updateUser: User;
};

export type MutationAcceptCollaborateInvitationArgs = {
  documentID: Scalars["ID"]["input"];
};

export type MutationAddCollaboratorArgs = {
  documentID: Scalars["ID"]["input"];
  userID: Scalars["ID"]["input"];
};

export type MutationCreateDocumentArgs = {
  input: CreateDocumentInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeclineCollaborateInvitationArgs = {
  documentID: Scalars["ID"]["input"];
};

export type MutationDeleteDocumentArgs = {
  documentID: Scalars["ID"]["input"];
};

export type MutationDeleteUserArgs = {
  userID: Scalars["ID"]["input"];
};

export type MutationLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationRemoveCollaboratorArgs = {
  documentID: Scalars["ID"]["input"];
  userID: Scalars["ID"]["input"];
};

export type MutationUpdateDocumentArgs = {
  documentID: Scalars["ID"]["input"];
  input: UpdateDocumentInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  userID: Scalars["ID"]["input"];
};

export type PersonalInformation = {
  __typename?: "PersonalInformation";
  DOB?: Maybe<Scalars["DateTime"]["output"]>;
  firstName: Scalars["String"]["output"];
  lastName?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalInformationInput = {
  DOB?: InputMaybe<Scalars["DateTime"]["input"]>;
  firstName: Scalars["String"]["input"];
  lastName?: InputMaybe<Scalars["String"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  getAllDocuments: Array<Document>;
  getAllUsers: Array<User>;
  getDocumentByID?: Maybe<Document>;
  getUserByID?: Maybe<User>;
};

export type QueryGetDocumentByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetUserByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"]["output"];
  deletedAt?: Maybe<Scalars["DateTime"]["output"]>;
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  isCollaborating: Array<Document>;
  isFavorite: Array<Maybe<Document>>;
  ownership: Array<Document>;
  password: Scalars["String"]["output"];
  personalInformation?: Maybe<PersonalInformation>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type CreateDocumentInput = {
  content: Scalars["String"]["input"];
  isPublic: Scalars["Boolean"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateUserInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  personalInformation: PersonalInformationInput;
};

export type UpdateDocumentInput = {
  content: Scalars["String"]["input"];
  isPublic: Scalars["Boolean"]["input"];
  title: Scalars["String"]["input"];
};

export type UpdateUserInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  personalInformation: PersonalInformationInput;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]["output"]>;
  Document: ResolverTypeWrapper<Document>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PersonalInformation: ResolverTypeWrapper<PersonalInformation>;
  PersonalInformationInput: PersonalInformationInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  User: ResolverTypeWrapper<User>;
  createDocumentInput: CreateDocumentInput;
  createUserInput: CreateUserInput;
  updateDocumentInput: UpdateDocumentInput;
  updateUserInput: UpdateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  Boolean: Scalars["Boolean"]["output"];
  DateTime: Scalars["DateTime"]["output"];
  Document: Document;
  ID: Scalars["ID"]["output"];
  Mutation: Record<PropertyKey, never>;
  PersonalInformation: PersonalInformation;
  PersonalInformationInput: PersonalInformationInput;
  Query: Record<PropertyKey, never>;
  String: Scalars["String"]["output"];
  User: User;
  createDocumentInput: CreateDocumentInput;
  createUserInput: CreateUserInput;
  updateDocumentInput: UpdateDocumentInput;
  updateUserInput: UpdateUserInput;
};

export type AuthPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AuthPayload"] = ResolversParentTypes["AuthPayload"]
> = {
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type DocumentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Document"] = ResolversParentTypes["Document"]
> = {
  collaborators?: Resolver<
    Array<ResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  deletedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  acceptCollaborateInvitation?: Resolver<
    ResolversTypes["Document"],
    ParentType,
    ContextType,
    RequireFields<MutationAcceptCollaborateInvitationArgs, "documentID">
  >;
  addCollaborator?: Resolver<
    ResolversTypes["Document"],
    ParentType,
    ContextType,
    RequireFields<MutationAddCollaboratorArgs, "documentID" | "userID">
  >;
  createDocument?: Resolver<
    ResolversTypes["Document"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDocumentArgs, "input">
  >;
  createUser?: Resolver<
    ResolversTypes["AuthPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, "input">
  >;
  declineCollaborateInvitation?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationDeclineCollaborateInvitationArgs, "documentID">
  >;
  deleteDocument?: Resolver<
    ResolversTypes["DateTime"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDocumentArgs, "documentID">
  >;
  deleteUser?: Resolver<
    ResolversTypes["DateTime"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, "userID">
  >;
  login?: Resolver<
    ResolversTypes["AuthPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  logout?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  removeCollaborator?: Resolver<
    ResolversTypes["Document"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveCollaboratorArgs, "documentID" | "userID">
  >;
  updateDocument?: Resolver<
    ResolversTypes["Document"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDocumentArgs, "documentID" | "input">
  >;
  updateUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, "input" | "userID">
  >;
};

export type PersonalInformationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["PersonalInformation"] = ResolversParentTypes["PersonalInformation"]
> = {
  DOB?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  getAllDocuments?: Resolver<
    Array<ResolversTypes["Document"]>,
    ParentType,
    ContextType
  >;
  getAllUsers?: Resolver<
    Array<ResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
  getDocumentByID?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetDocumentByIdArgs, "id">
  >;
  getUserByID?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetUserByIdArgs, "id">
  >;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  deletedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  isCollaborating?: Resolver<
    Array<ResolversTypes["Document"]>,
    ParentType,
    ContextType
  >;
  isFavorite?: Resolver<
    Array<Maybe<ResolversTypes["Document"]>>,
    ParentType,
    ContextType
  >;
  ownership?: Resolver<
    Array<ResolversTypes["Document"]>,
    ParentType,
    ContextType
  >;
  password?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  personalInformation?: Resolver<
    Maybe<ResolversTypes["PersonalInformation"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PersonalInformation?: PersonalInformationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
