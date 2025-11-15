import typeDefs from "./typeDefs.js";
import inputDefs from "./inputDefs.js";
import mutationDefs from "./mutationDefs.js";
import queryDefs from "./queryDefs.js";

const schema = [queryDefs, mutationDefs, typeDefs, inputDefs];

export default schema;
