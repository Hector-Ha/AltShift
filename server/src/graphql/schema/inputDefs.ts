import { gql } from "graphql-tag";

const inputDefs = gql`
  # Document
  input createDocumentInput {
    title: String!
    content: String!
    isPublic: Boolean!
  }

  input updateDocumentInput {
    title: String!
    content: String!
    isPublic: Boolean!
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
    email: String!
    password: String!
    personalInformation: PersonalInformationInput!
  }
`;

export default inputDefs;
