import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserDocument } from '../models/MUser.js';
import { DocumentDocument } from '../models/MDocument.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Document = {
  __typename?: 'Document';
  collaborators: Array<User>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  invitations?: Maybe<Array<User>>;
  /** @deprecated Use visibility instead */
  isPublic: Scalars['Boolean']['output'];
  owner: User;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  versions: Array<DocumentVersion>;
  visibility: DocumentStatus;
};

export type DocumentFilterInput = {
  isCollaborating?: InputMaybe<Scalars['Boolean']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  isOwned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<DocumentStatus>;
};

export type DocumentSortInput = {
  accending?: InputMaybe<Scalars['Boolean']['input']>;
  field: Scalars['String']['input'];
};

export enum DocumentStatus {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Shared = 'SHARED'
}

export type DocumentVersion = {
  __typename?: 'DocumentVersion';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  documentId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptCollaborateInvitation: Document;
  addCollaborator: Document;
  changePassword: Scalars['Boolean']['output'];
  createDocument: Document;
  createSnapshot: DocumentVersion;
  createUser: AuthPayload;
  declineCollaborateInvitation: Scalars['Boolean']['output'];
  deleteDocument: Scalars['DateTime']['output'];
  deleteUser: Scalars['DateTime']['output'];
  duplicateDocument: Document;
  hardDeleteDocument: Scalars['Boolean']['output'];
  hardDeleteUser: Scalars['Boolean']['output'];
  leaveDocument: Scalars['Boolean']['output'];
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  removeCollaborator: Document;
  resetPassword: Scalars['Boolean']['output'];
  restoreDocument: Document;
  revertToSnapshot: Document;
  transferOwnership: Document;
  updateDocument: Document;
  updateUser: User;
  verifyEmail: Scalars['Boolean']['output'];
};


export type MutationAcceptCollaborateInvitationArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationAddCollaboratorArgs = {
  documentID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
  userID: Scalars['ID']['input'];
};


export type MutationCreateDocumentArgs = {
  input: CreateDocumentInput;
};


export type MutationCreateSnapshotArgs = {
  documentID: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeclineCollaborateInvitationArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationDeleteDocumentArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  userID: Scalars['ID']['input'];
};


export type MutationDuplicateDocumentArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationHardDeleteDocumentArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationHardDeleteUserArgs = {
  userID: Scalars['ID']['input'];
};


export type MutationLeaveDocumentArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveCollaboratorArgs = {
  documentID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationRestoreDocumentArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationRevertToSnapshotArgs = {
  documentID: Scalars['ID']['input'];
  snapshotID: Scalars['ID']['input'];
};


export type MutationTransferOwnershipArgs = {
  documentID: Scalars['ID']['input'];
  input: TransferOwnershipInput;
};


export type MutationUpdateDocumentArgs = {
  documentID: Scalars['ID']['input'];
  input: UpdateDocumentInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  userID: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PersonalInformation = {
  __typename?: 'PersonalInformation';
  DOB?: Maybe<Scalars['DateTime']['output']>;
  firstName: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
};

export type PersonalInformationInput = {
  DOB?: InputMaybe<Scalars['DateTime']['input']>;
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAllUsers: Array<User>;
  getDocumentByID?: Maybe<Document>;
  getDocuments: Array<Document>;
  getDocumentsInTrash: Array<Document>;
  getUserByID?: Maybe<User>;
};


export type QueryGetDocumentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDocumentsArgs = {
  filter?: InputMaybe<DocumentFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<DocumentSortInput>;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCollaborating: Array<Document>;
  isFavorite: Array<Maybe<Document>>;
  ownership: Array<Document>;
  personalInformation: PersonalInformation;
  profilePicture?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type CreateDocumentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  visibility?: InputMaybe<DocumentStatus>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  personalInformation: PersonalInformationInput;
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type TransferOwnershipInput = {
  newOwnerID: Scalars['ID']['input'];
};

export type UpdateDocumentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<DocumentStatus>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  personalInformation?: InputMaybe<PersonalInformationInput>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<Omit<AuthPayload, 'user'> & { user: ResolversTypes['User'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Document: ResolverTypeWrapper<DocumentDocument>;
  DocumentFilterInput: DocumentFilterInput;
  DocumentSortInput: DocumentSortInput;
  DocumentStatus: DocumentStatus;
  DocumentVersion: ResolverTypeWrapper<DocumentVersion>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PaginationInput: PaginationInput;
  PersonalInformation: ResolverTypeWrapper<PersonalInformation>;
  PersonalInformationInput: PersonalInformationInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<UserDocument>;
  changePasswordInput: ChangePasswordInput;
  createDocumentInput: CreateDocumentInput;
  createUserInput: CreateUserInput;
  resetPasswordInput: ResetPasswordInput;
  transferOwnershipInput: TransferOwnershipInput;
  updateDocumentInput: UpdateDocumentInput;
  updateUserInput: UpdateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: Omit<AuthPayload, 'user'> & { user: ResolversParentTypes['User'] };
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Document: DocumentDocument;
  DocumentFilterInput: DocumentFilterInput;
  DocumentSortInput: DocumentSortInput;
  DocumentVersion: DocumentVersion;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  PaginationInput: PaginationInput;
  PersonalInformation: PersonalInformation;
  PersonalInformationInput: PersonalInformationInput;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  User: UserDocument;
  changePasswordInput: ChangePasswordInput;
  createDocumentInput: CreateDocumentInput;
  createUserInput: CreateUserInput;
  resetPasswordInput: ResetPasswordInput;
  transferOwnershipInput: TransferOwnershipInput;
  updateDocumentInput: UpdateDocumentInput;
  updateUserInput: UpdateUserInput;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  collaborators?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invitations?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  versions?: Resolver<Array<ResolversTypes['DocumentVersion']>, ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['DocumentStatus'], ParentType, ContextType>;
};

export type DocumentVersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentVersion'] = ResolversParentTypes['DocumentVersion']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  documentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptCollaborateInvitation?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationAcceptCollaborateInvitationArgs, 'documentID'>>;
  addCollaborator?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationAddCollaboratorArgs, 'documentID' | 'userID'>>;
  changePassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'input' | 'userID'>>;
  createDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationCreateDocumentArgs, 'input'>>;
  createSnapshot?: Resolver<ResolversTypes['DocumentVersion'], ParentType, ContextType, RequireFields<MutationCreateSnapshotArgs, 'documentID'>>;
  createUser?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  declineCollaborateInvitation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeclineCollaborateInvitationArgs, 'documentID'>>;
  deleteDocument?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType, RequireFields<MutationDeleteDocumentArgs, 'documentID'>>;
  deleteUser?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'userID'>>;
  duplicateDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationDuplicateDocumentArgs, 'documentID'>>;
  hardDeleteDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationHardDeleteDocumentArgs, 'documentID'>>;
  hardDeleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationHardDeleteUserArgs, 'userID'>>;
  leaveDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLeaveDocumentArgs, 'documentID'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  removeCollaborator?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationRemoveCollaboratorArgs, 'documentID' | 'userID'>>;
  resetPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'input'>>;
  restoreDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationRestoreDocumentArgs, 'documentID'>>;
  revertToSnapshot?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationRevertToSnapshotArgs, 'documentID' | 'snapshotID'>>;
  transferOwnership?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationTransferOwnershipArgs, 'documentID' | 'input'>>;
  updateDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpdateDocumentArgs, 'documentID' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input' | 'userID'>>;
  verifyEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'token'>>;
};

export type PersonalInformationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonalInformation'] = ResolversParentTypes['PersonalInformation']> = {
  DOB?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getDocumentByID?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryGetDocumentByIdArgs, 'id'>>;
  getDocuments?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, Partial<QueryGetDocumentsArgs>>;
  getDocumentsInTrash?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType>;
  getUserByID?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCollaborating?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType>;
  isFavorite?: Resolver<Array<Maybe<ResolversTypes['Document']>>, ParentType, ContextType>;
  ownership?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType>;
  personalInformation?: Resolver<ResolversTypes['PersonalInformation'], ParentType, ContextType>;
  profilePicture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentVersion?: DocumentVersionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PersonalInformation?: PersonalInformationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

