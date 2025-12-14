import { UserDocument } from "../models/MUser.js";

export interface ActiveUser {
  socketId: string;
  userId: string;
  email: string;
  firstName?: string;
  profilePicture?: string;
  color: string;
}

export interface ServerToClientEvents {
  error: (error: { message: string }) => void;
  "active-users": (users: ActiveUser[]) => void;
  "join-document": (user: ActiveUser) => void;
  "text-update": (operation: any) => void;
  "cursor-move": (data: { userId: string; range: any }) => void;
  "doc-activity": (activity: any) => void;
  "new-notification": (notification: any) => void;
}

export interface ClientToServerEvents {
  "join-document": (documentId: string) => void;
  "text-update": (data: { documentId: string; operation: any }) => void;
  "cursor-move": (data: { documentId: string; range: any }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: UserDocument;
  documentID?: string;
  hasUnsavedChanges?: boolean;
}
