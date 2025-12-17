/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation InviteCollaborator($documentID: ID!, $email: String!) {\n    inviteCollaborator(documentID: $documentID, email: $email) {\n      id\n      visibility\n      invitations {\n        id\n      }\n    }\n  }\n": typeof types.InviteCollaboratorDocument,
    "\n  query MyNotifications($filter: NotificationFilter) {\n    myNotifications(filter: $filter) {\n      id\n      message\n      read\n      createdAt\n      type\n      document {\n        id\n        title\n      }\n      sender {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n": typeof types.MyNotificationsDocument,
    "\n  mutation MarkNotificationAsRead($notificationId: ID!) {\n    markNotificationAsRead(notificationId: $notificationId) {\n      id\n      read\n    }\n  }\n": typeof types.MarkNotificationAsReadDocument,
    "\n  mutation AcceptCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    acceptCollaborateInvitation(documentID: $documentID, notificationID: $notificationID) {\n      id\n      title\n    }\n  }\n": typeof types.AcceptCollaborateInvitationDocument,
    "\n  mutation DeclineCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    declineCollaborateInvitation(documentID: $documentID, notificationID: $notificationID)\n  }\n": typeof types.DeclineCollaborateInvitationDocument,
    "\n  mutation UpdateDocumentVisibility($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      visibility\n      isPublic\n    }\n  }\n": typeof types.UpdateDocumentVisibilityDocument,
    "\n      mutation InviteCollaborator($documentID: ID!, $email: String!) {\n        inviteCollaborator(documentID: $documentID, email: $email) {\n          id\n          visibility\n          invitations {\n            id\n          }\n        }\n      }\n    ": typeof types.InviteCollaboratorDocument,
    "\n  query GetDocuments($filter: DocumentFilterInput) {\n    getDocuments(filter: $filter) {\n      id\n      title\n      updatedAt\n      visibility\n      owner {\n        id\n        email\n      }\n    }\n  }\n": typeof types.GetDocumentsDocument,
    "\n  mutation CreateDocument($input: createDocumentInput!) {\n    createDocument(input: $input) {\n      id\n      title\n    }\n  }\n": typeof types.CreateDocumentDocument,
    "\n  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {\n    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {\n      id\n      title\n    }\n  }\n": typeof types.CreateDocumentWithAiDocument,
    "\n  query GetDocument($id: ID!) {\n    getDocumentByID(id: $id) {\n      id\n      title\n      content\n      visibility\n      isArchived\n      scheduledDeletionTime\n      archiveType\n      owner {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n      collaborators {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n": typeof types.GetDocumentDocument,
    "\n  mutation UpdateDocument($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      content\n    }\n  }\n": typeof types.UpdateDocumentDocument,
    "\n  mutation ArchiveDocument($documentID: ID!, $type: ArchiveType!, $removeCollaborators: Boolean!) {\n    archiveDocument(documentID: $documentID, type: $type, removeCollaborators: $removeCollaborators) {\n      id\n      isArchived\n      scheduledDeletionTime\n    }\n  }\n": typeof types.ArchiveDocumentDocument,
    "\n  mutation UnarchiveDocument($documentID: ID!) {\n    unarchiveDocument(documentID: $documentID) {\n      id\n      isArchived\n    }\n  }\n": typeof types.UnarchiveDocumentDocument,
    "\n  mutation CancelScheduledDeletion($documentID: ID!) {\n    cancelScheduledDeletion(documentID: $documentID) {\n      id\n      scheduledDeletionTime\n      archiveType\n    }\n  }\n": typeof types.CancelScheduledDeletionDocument,
    "\n  mutation DeleteDocumentImmediately($documentID: ID!) {\n    deleteDocumentImmediately(documentID: $documentID)\n  }\n": typeof types.DeleteDocumentImmediatelyDocument,
    "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation ResetPassword($input: resetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation CreateUser($input: createUserInput!) {\n    createUser(input: $input) {\n      token\n      user {\n        id\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
};
const documents: Documents = {
    "\n  mutation InviteCollaborator($documentID: ID!, $email: String!) {\n    inviteCollaborator(documentID: $documentID, email: $email) {\n      id\n      visibility\n      invitations {\n        id\n      }\n    }\n  }\n": types.InviteCollaboratorDocument,
    "\n  query MyNotifications($filter: NotificationFilter) {\n    myNotifications(filter: $filter) {\n      id\n      message\n      read\n      createdAt\n      type\n      document {\n        id\n        title\n      }\n      sender {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n": types.MyNotificationsDocument,
    "\n  mutation MarkNotificationAsRead($notificationId: ID!) {\n    markNotificationAsRead(notificationId: $notificationId) {\n      id\n      read\n    }\n  }\n": types.MarkNotificationAsReadDocument,
    "\n  mutation AcceptCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    acceptCollaborateInvitation(documentID: $documentID, notificationID: $notificationID) {\n      id\n      title\n    }\n  }\n": types.AcceptCollaborateInvitationDocument,
    "\n  mutation DeclineCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    declineCollaborateInvitation(documentID: $documentID, notificationID: $notificationID)\n  }\n": types.DeclineCollaborateInvitationDocument,
    "\n  mutation UpdateDocumentVisibility($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      visibility\n      isPublic\n    }\n  }\n": types.UpdateDocumentVisibilityDocument,
    "\n      mutation InviteCollaborator($documentID: ID!, $email: String!) {\n        inviteCollaborator(documentID: $documentID, email: $email) {\n          id\n          visibility\n          invitations {\n            id\n          }\n        }\n      }\n    ": types.InviteCollaboratorDocument,
    "\n  query GetDocuments($filter: DocumentFilterInput) {\n    getDocuments(filter: $filter) {\n      id\n      title\n      updatedAt\n      visibility\n      owner {\n        id\n        email\n      }\n    }\n  }\n": types.GetDocumentsDocument,
    "\n  mutation CreateDocument($input: createDocumentInput!) {\n    createDocument(input: $input) {\n      id\n      title\n    }\n  }\n": types.CreateDocumentDocument,
    "\n  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {\n    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {\n      id\n      title\n    }\n  }\n": types.CreateDocumentWithAiDocument,
    "\n  query GetDocument($id: ID!) {\n    getDocumentByID(id: $id) {\n      id\n      title\n      content\n      visibility\n      isArchived\n      scheduledDeletionTime\n      archiveType\n      owner {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n      collaborators {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n": types.GetDocumentDocument,
    "\n  mutation UpdateDocument($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      content\n    }\n  }\n": types.UpdateDocumentDocument,
    "\n  mutation ArchiveDocument($documentID: ID!, $type: ArchiveType!, $removeCollaborators: Boolean!) {\n    archiveDocument(documentID: $documentID, type: $type, removeCollaborators: $removeCollaborators) {\n      id\n      isArchived\n      scheduledDeletionTime\n    }\n  }\n": types.ArchiveDocumentDocument,
    "\n  mutation UnarchiveDocument($documentID: ID!) {\n    unarchiveDocument(documentID: $documentID) {\n      id\n      isArchived\n    }\n  }\n": types.UnarchiveDocumentDocument,
    "\n  mutation CancelScheduledDeletion($documentID: ID!) {\n    cancelScheduledDeletion(documentID: $documentID) {\n      id\n      scheduledDeletionTime\n      archiveType\n    }\n  }\n": types.CancelScheduledDeletionDocument,
    "\n  mutation DeleteDocumentImmediately($documentID: ID!) {\n    deleteDocumentImmediately(documentID: $documentID)\n  }\n": types.DeleteDocumentImmediatelyDocument,
    "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation ResetPassword($input: resetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n": types.ResetPasswordDocument,
    "\n  mutation CreateUser($input: createUserInput!) {\n    createUser(input: $input) {\n      token\n      user {\n        id\n      }\n    }\n  }\n": types.CreateUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation InviteCollaborator($documentID: ID!, $email: String!) {\n    inviteCollaborator(documentID: $documentID, email: $email) {\n      id\n      visibility\n      invitations {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation InviteCollaborator($documentID: ID!, $email: String!) {\n    inviteCollaborator(documentID: $documentID, email: $email) {\n      id\n      visibility\n      invitations {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query MyNotifications($filter: NotificationFilter) {\n    myNotifications(filter: $filter) {\n      id\n      message\n      read\n      createdAt\n      type\n      document {\n        id\n        title\n      }\n      sender {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyNotifications($filter: NotificationFilter) {\n    myNotifications(filter: $filter) {\n      id\n      message\n      read\n      createdAt\n      type\n      document {\n        id\n        title\n      }\n      sender {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MarkNotificationAsRead($notificationId: ID!) {\n    markNotificationAsRead(notificationId: $notificationId) {\n      id\n      read\n    }\n  }\n"): (typeof documents)["\n  mutation MarkNotificationAsRead($notificationId: ID!) {\n    markNotificationAsRead(notificationId: $notificationId) {\n      id\n      read\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AcceptCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    acceptCollaborateInvitation(documentID: $documentID, notificationID: $notificationID) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    acceptCollaborateInvitation(documentID: $documentID, notificationID: $notificationID) {\n      id\n      title\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeclineCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    declineCollaborateInvitation(documentID: $documentID, notificationID: $notificationID)\n  }\n"): (typeof documents)["\n  mutation DeclineCollaborateInvitation($documentID: ID!, $notificationID: ID) {\n    declineCollaborateInvitation(documentID: $documentID, notificationID: $notificationID)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDocumentVisibility($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      visibility\n      isPublic\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDocumentVisibility($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      visibility\n      isPublic\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation InviteCollaborator($documentID: ID!, $email: String!) {\n        inviteCollaborator(documentID: $documentID, email: $email) {\n          id\n          visibility\n          invitations {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation InviteCollaborator($documentID: ID!, $email: String!) {\n        inviteCollaborator(documentID: $documentID, email: $email) {\n          id\n          visibility\n          invitations {\n            id\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDocuments($filter: DocumentFilterInput) {\n    getDocuments(filter: $filter) {\n      id\n      title\n      updatedAt\n      visibility\n      owner {\n        id\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDocuments($filter: DocumentFilterInput) {\n    getDocuments(filter: $filter) {\n      id\n      title\n      updatedAt\n      visibility\n      owner {\n        id\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateDocument($input: createDocumentInput!) {\n    createDocument(input: $input) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDocument($input: createDocumentInput!) {\n    createDocument(input: $input) {\n      id\n      title\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {\n    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {\n    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {\n      id\n      title\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDocument($id: ID!) {\n    getDocumentByID(id: $id) {\n      id\n      title\n      content\n      visibility\n      isArchived\n      scheduledDeletionTime\n      archiveType\n      owner {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n      collaborators {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDocument($id: ID!) {\n    getDocumentByID(id: $id) {\n      id\n      title\n      content\n      visibility\n      isArchived\n      scheduledDeletionTime\n      archiveType\n      owner {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n      collaborators {\n        id\n        email\n        personalInformation {\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDocument($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      content\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDocument($id: ID!, $input: updateDocumentInput!) {\n    updateDocument(documentID: $id, input: $input) {\n      id\n      content\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ArchiveDocument($documentID: ID!, $type: ArchiveType!, $removeCollaborators: Boolean!) {\n    archiveDocument(documentID: $documentID, type: $type, removeCollaborators: $removeCollaborators) {\n      id\n      isArchived\n      scheduledDeletionTime\n    }\n  }\n"): (typeof documents)["\n  mutation ArchiveDocument($documentID: ID!, $type: ArchiveType!, $removeCollaborators: Boolean!) {\n    archiveDocument(documentID: $documentID, type: $type, removeCollaborators: $removeCollaborators) {\n      id\n      isArchived\n      scheduledDeletionTime\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnarchiveDocument($documentID: ID!) {\n    unarchiveDocument(documentID: $documentID) {\n      id\n      isArchived\n    }\n  }\n"): (typeof documents)["\n  mutation UnarchiveDocument($documentID: ID!) {\n    unarchiveDocument(documentID: $documentID) {\n      id\n      isArchived\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CancelScheduledDeletion($documentID: ID!) {\n    cancelScheduledDeletion(documentID: $documentID) {\n      id\n      scheduledDeletionTime\n      archiveType\n    }\n  }\n"): (typeof documents)["\n  mutation CancelScheduledDeletion($documentID: ID!) {\n    cancelScheduledDeletion(documentID: $documentID) {\n      id\n      scheduledDeletionTime\n      archiveType\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteDocumentImmediately($documentID: ID!) {\n    deleteDocumentImmediately(documentID: $documentID)\n  }\n"): (typeof documents)["\n  mutation DeleteDocumentImmediately($documentID: ID!) {\n    deleteDocumentImmediately(documentID: $documentID)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n"): (typeof documents)["\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ResetPassword($input: resetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation ResetPassword($input: resetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($input: createUserInput!) {\n    createUser(input: $input) {\n      token\n      user {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: createUserInput!) {\n    createUser(input: $input) {\n      token\n      user {\n        id\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;