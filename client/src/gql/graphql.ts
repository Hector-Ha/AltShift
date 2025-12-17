/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ArchiveType =
  | 'MANUAL'
  | 'SCHEDULED';

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

export type DocumentStatus =
  | 'PRIVATE'
  | 'PUBLIC'
  | 'SHARED';

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
  inviteCollaborator: Document;
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
  notificationID?: InputMaybe<Scalars['ID']['input']>;
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
  notificationID?: InputMaybe<Scalars['ID']['input']>;
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


export type MutationInviteCollaboratorArgs = {
  documentID: Scalars['ID']['input'];
  email: Scalars['String']['input'];
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

export type NotificationType =
  | 'DOCUMENT_DELETE'
  | 'DOCUMENT_INVITE'
  | 'DOCUMENT_UPDATE'
  | 'OWNERSHIP_TRANSFER';

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PersonalInformation = {
  __typename?: 'PersonalInformation';
  DOB?: Maybe<Scalars['DateTime']['output']>;
  firstName: Scalars['String']['output'];
  jobTitle?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  organization: Scalars['String']['output'];
};

export type PersonalInformationInput = {
  DOB?: InputMaybe<Scalars['DateTime']['input']>;
  firstName: Scalars['String']['input'];
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  organization: Scalars['String']['input'];
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

export type MyNotificationsQueryVariables = Exact<{
  filter?: InputMaybe<NotificationFilter>;
}>;


export type MyNotificationsQuery = { __typename?: 'Query', myNotifications: Array<{ __typename?: 'Notification', id: string, message: string, read: boolean, createdAt: any, type: NotificationType, document?: { __typename?: 'Document', id: string, title: string } | null, sender: { __typename?: 'User', id: string, email: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string, lastName: string } } }> };

export type MarkNotificationAsReadMutationVariables = Exact<{
  notificationId: Scalars['ID']['input'];
}>;


export type MarkNotificationAsReadMutation = { __typename?: 'Mutation', markNotificationAsRead: { __typename?: 'Notification', id: string, read: boolean } };

export type AcceptCollaborateInvitationMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
  notificationID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AcceptCollaborateInvitationMutation = { __typename?: 'Mutation', acceptCollaborateInvitation: { __typename?: 'Document', id: string, title: string } };

export type DeclineCollaborateInvitationMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
  notificationID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type DeclineCollaborateInvitationMutation = { __typename?: 'Mutation', declineCollaborateInvitation: boolean };

export type UpdateVisibilityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateDocumentInput;
}>;


export type UpdateVisibilityMutation = { __typename?: 'Mutation', updateDocument: { __typename?: 'Document', id: string, visibility: DocumentStatus, isPublic: boolean } };

export type InviteCollaboratorMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
  email: Scalars['String']['input'];
}>;


export type InviteCollaboratorMutation = { __typename?: 'Mutation', inviteCollaborator: { __typename?: 'Document', id: string, visibility: DocumentStatus, invitations?: Array<{ __typename?: 'User', id: string }> | null } };

export type RemoveCollaboratorMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
}>;


export type RemoveCollaboratorMutation = { __typename?: 'Mutation', removeCollaborator: { __typename?: 'Document', id: string, collaborators: Array<{ __typename?: 'User', id: string }> } };

export type GetDocUsersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDocUsersQuery = { __typename?: 'Query', getDocumentByID?: { __typename?: 'Document', id: string, owner: { __typename?: 'User', id: string, email: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string } }, collaborators: Array<{ __typename?: 'User', id: string, email: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string } }>, invitations?: Array<{ __typename?: 'User', id: string, email: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string } }> | null } | null };

export type GetDocumentsQueryVariables = Exact<{
  filter?: InputMaybe<DocumentFilterInput>;
}>;


export type GetDocumentsQuery = { __typename?: 'Query', getDocuments: Array<{ __typename?: 'Document', id: string, title: string, updatedAt: any, visibility: DocumentStatus, owner: { __typename?: 'User', id: string, email: string } }> };

export type CreateDocumentMutationVariables = Exact<{
  input: CreateDocumentInput;
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'Document', id: string, title: string } };

export type CreateDocumentWithAiMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  attachments?: InputMaybe<Array<InputMaybe<AttachmentInput>> | InputMaybe<AttachmentInput>>;
}>;


export type CreateDocumentWithAiMutation = { __typename?: 'Mutation', createDocumentWithAI: { __typename?: 'Document', id: string, title: string } };

export type GetUserHeaderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserHeaderQuery = { __typename?: 'Query', getUserByID?: { __typename?: 'User', id: string, profilePicture?: string | null, personalInformation: { __typename?: 'PersonalInformation', firstName: string, lastName: string } } | null };

export type GetDocumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', getDocumentByID?: { __typename?: 'Document', id: string, title: string, content: string, visibility: DocumentStatus, isArchived?: boolean | null, scheduledDeletionTime?: any | null, archiveType?: ArchiveType | null, owner: { __typename?: 'User', id: string, email: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string, lastName: string } }, collaborators: Array<{ __typename?: 'User', id: string, email: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string, lastName: string } }> } | null };

export type UpdateDocumentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateDocumentInput;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', updateDocument: { __typename?: 'Document', id: string, content: string } };

export type ArchiveDocumentMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
  type: ArchiveType;
  removeCollaborators: Scalars['Boolean']['input'];
}>;


export type ArchiveDocumentMutation = { __typename?: 'Mutation', archiveDocument: { __typename?: 'Document', id: string, isArchived?: boolean | null, scheduledDeletionTime?: any | null } };

export type UnarchiveDocumentMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
}>;


export type UnarchiveDocumentMutation = { __typename?: 'Mutation', unarchiveDocument: { __typename?: 'Document', id: string, isArchived?: boolean | null } };

export type CancelScheduledDeletionMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
}>;


export type CancelScheduledDeletionMutation = { __typename?: 'Mutation', cancelScheduledDeletion: { __typename?: 'Document', id: string, scheduledDeletionTime?: any | null, archiveType?: ArchiveType | null } };

export type DeleteDocumentImmediatelyMutationVariables = Exact<{
  documentID: Scalars['ID']['input'];
}>;


export type DeleteDocumentImmediatelyMutation = { __typename?: 'Mutation', deleteDocumentImmediately: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, email: string } } };

export type GetUserProfileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUserByID?: { __typename?: 'User', id: string, email: string, profilePicture?: string | null, personalInformation: { __typename?: 'PersonalInformation', firstName: string, lastName: string, jobTitle?: string | null, organization: string, DOB?: any | null } } | null };

export type UpdateUserMutationVariables = Exact<{
  userID: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, personalInformation: { __typename?: 'PersonalInformation', firstName: string, lastName: string, jobTitle?: string | null, organization: string, DOB?: any | null } } };

export type ChangePasswordMutationVariables = Exact<{
  userID: Scalars['ID']['input'];
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string } } };


export const MyNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const MarkNotificationAsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNotificationAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markNotificationAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"notificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"read"}}]}}]}}]} as unknown as DocumentNode<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const AcceptCollaborateInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptCollaborateInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptCollaborateInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"notificationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AcceptCollaborateInvitationMutation, AcceptCollaborateInvitationMutationVariables>;
export const DeclineCollaborateInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeclineCollaborateInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineCollaborateInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"notificationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationID"}}}]}]}}]} as unknown as DocumentNode<DeclineCollaborateInvitationMutation, DeclineCollaborateInvitationMutationVariables>;
export const UpdateVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}}]}}]}}]} as unknown as DocumentNode<UpdateVisibilityMutation, UpdateVisibilityMutationVariables>;
export const InviteCollaboratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteCollaborator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteCollaborator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<InviteCollaboratorMutation, InviteCollaboratorMutationVariables>;
export const RemoveCollaboratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCollaborator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCollaborator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveCollaboratorMutation, RemoveCollaboratorMutationVariables>;
export const GetDocUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocumentByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetDocUsersQuery, GetDocUsersQueryVariables>;
export const GetDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GetDocumentsQuery, GetDocumentsQueryVariables>;
export const CreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const CreateDocumentWithAiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocumentWithAI"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocumentWithAI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prompt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}}},{"kind":"Argument","name":{"kind":"Name","value":"attachments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentWithAiMutation, CreateDocumentWithAiMutationVariables>;
export const GetUserHeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserHeader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]}}]} as unknown as DocumentNode<GetUserHeaderQuery, GetUserHeaderQueryVariables>;
export const GetDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocumentByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledDeletionTime"}},{"kind":"Field","name":{"kind":"Name","value":"archiveType"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetDocumentQuery, GetDocumentQueryVariables>;
export const UpdateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<UpdateDocumentMutation, UpdateDocumentMutationVariables>;
export const ArchiveDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"removeCollaborators"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"removeCollaborators"},"value":{"kind":"Variable","name":{"kind":"Name","value":"removeCollaborators"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledDeletionTime"}}]}}]}}]} as unknown as DocumentNode<ArchiveDocumentMutation, ArchiveDocumentMutationVariables>;
export const UnarchiveDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<UnarchiveDocumentMutation, UnarchiveDocumentMutationVariables>;
export const CancelScheduledDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelScheduledDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelScheduledDeletion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledDeletionTime"}},{"kind":"Field","name":{"kind":"Name","value":"archiveType"}}]}}]}}]} as unknown as DocumentNode<CancelScheduledDeletionMutation, CancelScheduledDeletionMutationVariables>;
export const DeleteDocumentImmediatelyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDocumentImmediately"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDocumentImmediately"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentID"}}}]}]}}]} as unknown as DocumentNode<DeleteDocumentImmediatelyMutation, DeleteDocumentImmediatelyMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"DOB"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"personalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"DOB"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"changePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"resetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;