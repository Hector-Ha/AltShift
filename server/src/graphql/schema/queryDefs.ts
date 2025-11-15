import { gql } from "graphql-tag";

const queryDefs = gql`
  type Query {
    # Document
    # [x] Get a single Document by ID
    # [ ] Get all Documents
    #   [ ] Search
    #       [ ] Status
    #           [ ] Owned
    #               [ ] Private
    #               [ ] Shared
    #               [ ] Public
    #               [ ] Deleted
    #           [ ] Collaborating
    #       [ ] Metadata
    #           [ ] Title
    #           [ ] Content (full-text search)
    #           [ ] Date range (createdAt, updatedAt)
    #       [ ] Tags/Labels
    #       [ ] Folder/Collection
    #   [ ] Sort
    #       [ ] Title
    #       [ ] createdAt
    #       [ ] updatedAt
    #   [ ] Pagination
    #       [ ] Limit
    #       [ ] Offset
    # [ ] Get recent documents
    # [ ] Get favorite/starred documents
    # [ ] Get document version history
    # [ ] Get documents in trash (soft deleted)
    # [ ] Get document collaborators with permissions
    # [ ] Get pending invitations (sent/received)

    getDocumentByID(id: ID!): Document
    getAllDocuments: [Document!]!

    # User
    # [x] Get a single User
    # [ ] Get all Users
    # [ ] Get Owner & Collaborators of a Document
    # [ ] Get current logged-in user
    # [ ] Get user's owned documents
    # [ ] Get user's shared documents (where user is collaborator)
    # [ ] Get user's activity feed
    # [ ] Get user preferences/settings

    getUserByID(id: ID!): User
    getAllUsers: [User!]!
  }
`;

export default queryDefs;
