import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar DateTime
  #Document
  type Document {
    id: ID!
    title: String!
    content: String!

    isPublic: Boolean!

    owner: User!
    collaborators: [User!]!

    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
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

    ownership: [Document!]!
    isCollaborating: [Document!]!
    isFavorite: [Document]!

    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }
`;

export default typeDefs;
