import documentQueryResolvers from "./documentQueryResolvers.js";
import userQueryResolvers from "./userQueryResolvers.js";

const queryResolvers = {
  ...documentQueryResolvers,
  ...userQueryResolvers,
};

export default queryResolvers;
