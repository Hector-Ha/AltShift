import { IDoc } from "../database/schema/document.js";
import { IUser } from "../database/schema/user.js";

export interface IApolloContext {
  dataSources: {
    doc: IDoc[];
    user: IUser[];
  };
}
