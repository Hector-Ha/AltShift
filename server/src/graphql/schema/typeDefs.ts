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

  type AuthPayload {
    user: User!
    token: String!
  }
`;

export default typeDefs;
