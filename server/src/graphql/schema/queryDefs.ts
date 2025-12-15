import { gql } from "graphql-tag";

const queryDefs = gql`
  type Query {
    # Document
    getDocumentByID(id: ID!): Document

    getDocuments(
      filter: DocumentFilterInput
      sort: DocumentSortInput
      pagination: PaginationInput
    ): [Document!]!

    getDocumentsInTrash: [Document!]!

    # User
    getUserByID(id: ID!): User
    # getMe: User

    getAllUsers: [User!]!
  }
`;

export default queryDefs;
