import { Types } from "mongoose";

export interface IPersonalInformation {
  firstName: string;
  lastName?: string;
  DOB?: Date;
  profilePicture?: string;
}

export interface IAuthPayload {
  user: IUser;
  token: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  personalInformation: IPersonalInformation;

  ownership: Types.ObjectId[];
  isCollaborating: Types.ObjectId[];
  isFavorite: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
