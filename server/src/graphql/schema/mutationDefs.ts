import { gql } from "graphql-tag";

const mutationDefs = gql`
  type Mutation {
    # Document
    # [ ] Create a document
    #   [1] From blank
    # [ ] Update a document
    #   [1] Metadata
    #       [1] Title
    #       [1] Content
    #       [1] (auto) updatedAt
    #   [ ] Document Status
    #       [1] To Public
    #       [2] To Shared
    #       [1] To Private
    #       [1] Is Favorite
    # [ ] Collaborators
    #   [1] Add collaborator (by user ID)
    #   [1] Remove collaborator
    #   [1] Accept invitation
    #   [1] Decline invitation
    #   [2] Leave document (remove self as collaborator)
    # [ ] Ownership
    #   [3] Transfer ownership (current owner becomes collaborator)
    # [ ] Delete a document
    #   [1] Soft delete (move to trash)
    #   [2] Restore from trash
    #   [3] Permanent delete (hard delete)
    # [2] Duplicate/Copy document
    # [ ] Version/Revision
    #   [4] Create snapshot/version
    #   [4] Revert to previous version

    createDocument(input: createDocumentInput!): Document!
    updateDocument(documentID: ID!, input: updateDocumentInput!): Document!
    deleteDocument(documentID: ID!): DateTime!

    addCollaborator(documentID: ID!, userID: ID!): Document!
    removeCollaborator(documentID: ID!, userID: ID!): Document!
    acceptCollaborateInvitation(documentID: ID!): Document!
    declineCollaborateInvitation(documentID: ID!): Boolean!

    # User
    # [1] Create a user (register)
    # [ ] Update a user
    #   [ ] Personal Information
    #       [1] firstName
    #       [1] lastName
    #       [1] DOB
    #   [ ] Profile
    #       [3] Profile picture/avatar
    # [ ] Authentication
    #   [1] Login
    #   [1] Logout
    #   [2] Change password
    #   [3] Reset password (forgot password)
    #   [3] Verify email
    # [2] Update email (might need verification)
    # [ ] Delete a user
    #   [1] Soft delete
    #   [2] Hard delete

    createUser(input: createUserInput!): AuthPayload!
    updateUser(userID: ID!, input: updateUserInput!): User!
    deleteUser(userID: ID!): DateTime!

    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
  }
`;

export default mutationDefs;
