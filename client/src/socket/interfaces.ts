import type { User } from "../gql/graphql";

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
  "new-notification": (notification: any) => void;
  "doc-activity": (data: {
    documentId: string;
    title: string;
    user: any;
    status: string;
  }) => void;
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
  user: User;
}
