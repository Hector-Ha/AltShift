import { gql } from "graphql-tag";

const inputDefs = gql`
  # Document
  input createDocumentInput {
    title: String!
    content: String
    visibility: DocumentStatus # Defaults to PRIVATE if null
  }

  input updateDocumentInput {
    title: String
    content: String
    visibility: DocumentStatus
    isFavorite: Boolean
  }

  input transferOwnershipInput {
    newOwnerID: ID!
  }

  # Query Filters
  input DocumentFilterInput {
    status: DocumentStatus
    isOwned: Boolean
    isCollaborating: Boolean
    isFavorite: Boolean
    isArchived: Boolean
    search: String # Title or Content
  }

  input DocumentSortInput {
    field: String! # title, createdAt, updatedAt
    accending: Boolean # default true
  }

  input PaginationInput {
    limit: Int
    offset: Int
  }

  # User
  input PersonalInformationInput {
    firstName: String!
    lastName: String
    DOB: DateTime
  }

  input createUserInput {
    email: String!
    password: String!
    personalInformation: PersonalInformationInput!
  }

  input updateUserInput {
    email: String
    # password: String # Separate mutation for password
    personalInformation: PersonalInformationInput
    profilePicture: String
  }

  input changePasswordInput {
    oldPassword: String!
    newPassword: String!
  }

  input resetPasswordInput {
    token: String!
    newPassword: String!
  }
`;

export default inputDefs;
