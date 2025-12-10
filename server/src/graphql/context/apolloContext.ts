import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel, UserDocument } from "../../models/MUser.js";

interface TokenPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ApolloContext {
  user: UserDocument | null;
  tokenPayload: TokenPayload | null;
  UserModel: typeof UserModel;
  req: Request;
  res: Response;
}

const apolloContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<ApolloContext> => {
  const authHeader = req.headers.authorization || "";

  let user: UserDocument | null = null;
  let tokenPayload: TokenPayload | null = null;

  if (!process.env.JWT_SECRET)
    throw Error("You need to set up your JWT_SECRET");

  if (authHeader) {
    try {
      const token = authHeader.replace("Bearer ", "").trim();

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

      tokenPayload = decoded;

      user = await UserModel.findById(decoded.id).select("-password");

      if (user?.deletedAt) {
        console.log("Attempted access with deleted user account");
        user = null;
      }
    } catch (error: any) {
      if (error.name === "JsonWebTokenError") {
        console.log("Invalid JWT token");
      } else if (error.name === "TokenExpiredError") {
        console.log("JWT token expired");
      } else {
        console.log("Token verification error:", error.message);
      }
    }
  }

  return {
    user,
    tokenPayload,
    UserModel,
    req,
    res,
  };
};

export default apolloContext;
