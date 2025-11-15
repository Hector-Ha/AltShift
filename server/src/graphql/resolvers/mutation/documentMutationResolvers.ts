import { DocumentModel } from "../../../models/MDocument.js";

const documentMutationResolvers = {
  createDocument(input: createDocumentInput!): Document!
    input createDocumentInput {
      title: String!
      content: String!
      isPublic: Boolean!
    }
  createDocument: async (_, {input}) => {
    const newDocument = new DocumentModel{
    }
    return newDocument
  },
};

export default documentMutationResolvers;
