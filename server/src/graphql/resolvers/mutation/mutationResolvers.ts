import documentMutationResolvers from "./documentMutationResolvers.js";
import userMutationResolvers from "./userMutationResolvers.js";
import aiResolvers from "./ai.js";

const mutationResolvers = {
  ...documentMutationResolvers,
  ...userMutationResolvers,
  ...aiResolvers,
};

export default mutationResolvers;
