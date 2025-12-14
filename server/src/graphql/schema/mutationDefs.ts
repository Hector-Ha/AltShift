import { gql } from "graphql-tag";

const mutationDefs = gql`
  input AttachmentInput {
    content: String!
    name: String!
    mimeType: String!
  }

  type Mutation {
    # --- Document ---

    # Create & Update
    createDocument(input: createDocumentInput!): Document!
    createDocumentWithAI(
      prompt: String!
      attachments: [AttachmentInput]
    ): Document!
    updateDocument(documentID: ID!, input: updateDocumentInput!): Document!

    # Collaborators
    addCollaborator(documentID: ID!, userID: ID!): Document! # Invite/Add
    removeCollaborator(documentID: ID!, userID: ID!): Document!
    acceptCollaborateInvitation(documentID: ID!): Document!
    declineCollaborateInvitation(documentID: ID!): Boolean!
    leaveDocument(documentID: ID!): Boolean!

    # Ownership
    transferOwnership(
      documentID: ID!
      input: transferOwnershipInput!
    ): Document!

    # Deletion
    # Soft delete (move to trash) - returns deletion timestamp
    deleteDocument(documentID: ID!): DateTime!
    # Restore from trash
    restoreDocument(documentID: ID!): Document!
    # Permanent delete
    hardDeleteDocument(documentID: ID!): Boolean!

    # Duplication
    duplicateDocument(documentID: ID!): Document!

    # Versioning
    createSnapshot(documentID: ID!, name: String): DocumentVersion!
    revertToSnapshot(documentID: ID!, snapshotID: ID!): Document!

    # --- User ---

    # Create (Register)
    createUser(input: createUserInput!): AuthPayload!

    # Update
    updateUser(userID: ID!, input: updateUserInput!): User!

    # Auth
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    changePassword(userID: ID!, input: changePasswordInput!): Boolean!
    resetPassword(input: resetPasswordInput!): Boolean!
    verifyEmail(token: String!): Boolean!

    # Delete
    deleteUser(userID: ID!): DateTime! # Soft delete
    hardDeleteUser(userID: ID!): Boolean!
  }
`;

export default mutationDefs;
