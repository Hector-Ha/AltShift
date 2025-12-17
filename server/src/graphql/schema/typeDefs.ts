import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar DateTime
  #Document
  type Document {
    id: ID!
    title: String!
    content: String!

    isPublic: Boolean! @deprecated(reason: "Use visibility instead")
    visibility: DocumentStatus!

    owner: User!
    collaborators: [User!]!
    invitations: [User!] # Users who have been invited but not accepted
    versions: [DocumentVersion!]!

    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime

    isArchived: Boolean
    archivedAt: DateTime
    archiveType: ArchiveType
    scheduledDeletionTime: DateTime
  }

  type DocumentVersion {
    id: ID!
    documentId: ID!
    content: String! # Snapshot of content
    createdAt: DateTime!
    # createdBy: User! # Optional: track who made the version
  }

  enum DocumentStatus {
    PUBLIC
    SHARED
    PRIVATE
  }

  enum ArchiveType {
    MANUAL
    SCHEDULED
  }

  #User
  type PersonalInformation {
    firstName: String!
    lastName: String
    DOB: DateTime
  }

  type User {
    id: ID!
    email: String!
    # password: String!
    personalInformation: PersonalInformation!
    profilePicture: String # URL to avatar
    ownership: [Document!]!
    isCollaborating: [Document!]!
    isFavorite: [Document]!

    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }

  type Notification {
    id: ID!
    recipient: User!
    sender: User!
    type: NotificationType!
    document: Document
    message: String!
    read: Boolean!
    createdAt: DateTime!
  }

  enum NotificationType {
    DOCUMENT_INVITE
    DOCUMENT_UPDATE
    DOCUMENT_DELETE
    OWNERSHIP_TRANSFER
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    myNotifications(filter: NotificationFilter): [Notification!]!
  }

  input NotificationFilter {
    read: Boolean
  }

  type Mutation {
    markNotificationAsRead(notificationId: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
  }
`;

export default typeDefs;
