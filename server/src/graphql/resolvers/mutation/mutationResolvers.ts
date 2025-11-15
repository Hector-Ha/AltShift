import documentMutationResolvers from "./documentMutationResolvers.js";
import userMutationResolvers from "./userMutationResolvers.js";

const mutationResolvers = {
  ...documentMutationResolvers,
  ...userMutationResolvers,
};

export default mutationResolvers;
