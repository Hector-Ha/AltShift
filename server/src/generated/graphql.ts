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

export enum ArchiveType {
  Manual = 'MANUAL',
  Scheduled = 'SCHEDULED'
}

export type AttachmentInput = {
  content: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Document = {
  __typename?: 'Document';
  archiveType?: Maybe<ArchiveType>;
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  collaborators: Array<User>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  invitations?: Maybe<Array<User>>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated Use visibility instead */
  isPublic: Scalars['Boolean']['output'];
  owner: User;
  scheduledDeletionTime?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  versions: Array<DocumentVersion>;
  visibility: DocumentStatus;
};

export type DocumentFilterInput = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
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
  archiveDocument: Document;
  cancelScheduledDeletion: Document;
  changePassword: Scalars['Boolean']['output'];
  createDocument: Document;
  createDocumentWithAI: Document;
  createSnapshot: DocumentVersion;
  createUser: AuthPayload;
  declineCollaborateInvitation: Scalars['Boolean']['output'];
  deleteDocument: Scalars['DateTime']['output'];
  deleteDocumentImmediately: Scalars['Boolean']['output'];
  deleteUser: Scalars['DateTime']['output'];
  duplicateDocument: Document;
  forgotPassword: Scalars['Boolean']['output'];
  hardDeleteDocument: Scalars['Boolean']['output'];
  hardDeleteUser: Scalars['Boolean']['output'];
  leaveDocument: Scalars['Boolean']['output'];
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Notification;
  removeCollaborator: Document;
  resetPassword: Scalars['Boolean']['output'];
  restoreDocument: Document;
  revertToSnapshot: Document;
  transferOwnership: Document;
  unarchiveDocument: Document;
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


export type MutationArchiveDocumentArgs = {
  documentID: Scalars['ID']['input'];
  removeCollaborators: Scalars['Boolean']['input'];
  type: ArchiveType;
};


export type MutationCancelScheduledDeletionArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
  userID: Scalars['ID']['input'];
};


export type MutationCreateDocumentArgs = {
  input: CreateDocumentInput;
};


export type MutationCreateDocumentWithAiArgs = {
  attachments?: InputMaybe<Array<InputMaybe<AttachmentInput>>>;
  prompt: Scalars['String']['input'];
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


export type MutationDeleteDocumentImmediatelyArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  userID: Scalars['ID']['input'];
};


export type MutationDuplicateDocumentArgs = {
  documentID: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
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


export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars['ID']['input'];
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


export type MutationUnarchiveDocumentArgs = {
  documentID: Scalars['ID']['input'];
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

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['DateTime']['output'];
  document?: Maybe<Document>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  read: Scalars['Boolean']['output'];
  recipient: User;
  sender: User;
  type: NotificationType;
};

export type NotificationFilter = {
  read?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum NotificationType {
  DocumentDelete = 'DOCUMENT_DELETE',
  DocumentInvite = 'DOCUMENT_INVITE',
  DocumentUpdate = 'DOCUMENT_UPDATE',
  OwnershipTransfer = 'OWNERSHIP_TRANSFER'
}

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
  myNotifications: Array<Notification>;
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


export type QueryMyNotificationsArgs = {
  filter?: InputMaybe<NotificationFilter>;
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
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
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
  ArchiveType: ArchiveType;
  AttachmentInput: AttachmentInput;
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
  Notification: ResolverTypeWrapper<Omit<Notification, 'document' | 'recipient' | 'sender'> & { document?: Maybe<ResolversTypes['Document']>, recipient: ResolversTypes['User'], sender: ResolversTypes['User'] }>;
  NotificationFilter: NotificationFilter;
  NotificationType: NotificationType;
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
  AttachmentInput: AttachmentInput;
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
  Notification: Omit<Notification, 'document' | 'recipient' | 'sender'> & { document?: Maybe<ResolversParentTypes['Document']>, recipient: ResolversParentTypes['User'], sender: ResolversParentTypes['User'] };
  NotificationFilter: NotificationFilter;
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
  archiveType?: Resolver<Maybe<ResolversTypes['ArchiveType']>, ParentType, ContextType>;
  archivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  collaborators?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invitations?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  isArchived?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  scheduledDeletionTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
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
  archiveDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationArchiveDocumentArgs, 'documentID' | 'removeCollaborators' | 'type'>>;
  cancelScheduledDeletion?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationCancelScheduledDeletionArgs, 'documentID'>>;
  changePassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'input' | 'userID'>>;
  createDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationCreateDocumentArgs, 'input'>>;
  createDocumentWithAI?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationCreateDocumentWithAiArgs, 'prompt'>>;
  createSnapshot?: Resolver<ResolversTypes['DocumentVersion'], ParentType, ContextType, RequireFields<MutationCreateSnapshotArgs, 'documentID'>>;
  createUser?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  declineCollaborateInvitation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeclineCollaborateInvitationArgs, 'documentID'>>;
  deleteDocument?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType, RequireFields<MutationDeleteDocumentArgs, 'documentID'>>;
  deleteDocumentImmediately?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDocumentImmediatelyArgs, 'documentID'>>;
  deleteUser?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'userID'>>;
  duplicateDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationDuplicateDocumentArgs, 'documentID'>>;
  forgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  hardDeleteDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationHardDeleteDocumentArgs, 'documentID'>>;
  hardDeleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationHardDeleteUserArgs, 'userID'>>;
  leaveDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLeaveDocumentArgs, 'documentID'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  markAllNotificationsAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  markNotificationAsRead?: Resolver<ResolversTypes['Notification'], ParentType, ContextType, RequireFields<MutationMarkNotificationAsReadArgs, 'notificationId'>>;
  removeCollaborator?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationRemoveCollaboratorArgs, 'documentID' | 'userID'>>;
  resetPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'input'>>;
  restoreDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationRestoreDocumentArgs, 'documentID'>>;
  revertToSnapshot?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationRevertToSnapshotArgs, 'documentID' | 'snapshotID'>>;
  transferOwnership?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationTransferOwnershipArgs, 'documentID' | 'input'>>;
  unarchiveDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUnarchiveDocumentArgs, 'documentID'>>;
  updateDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpdateDocumentArgs, 'documentID' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input' | 'userID'>>;
  verifyEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'token'>>;
};

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  document?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>;
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
  myNotifications?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType, Partial<QueryMyNotificationsArgs>>;
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
  Notification?: NotificationResolvers<ContextType>;
  PersonalInformation?: PersonalInformationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

