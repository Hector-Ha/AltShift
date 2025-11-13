import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Query {
    hello: String

    # Doc

    # User
    getUser(uuid: ID!): User
    getAllUsers: [User!]!
  }

  type Mutation {
    # Doc

    # User
    createUser(
      email: String!
      password: String!
      personalInformation: PersonalInformationInput!
    ): User!
  }

  type Doc {
    uuid: ID!
    title: String!
    content: String!
    isPublic: Boolean!
    owner: User!
    collaborators: [User!]!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
  }

  input PersonalInformationInput {
    firstName: String!
    lastName: String
    DOB: Date
  }

  type PersonalInformation {
    firstName: String!
    lastName: String
    DOB: Date
  }

  type User {
    uuid: ID!
    email: String!
    password: String!
    personalInformation: PersonalInformation
    ownership: [Doc!]!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
  }
`;

export default typeDefs;
