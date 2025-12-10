export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_DOCUMENT: "join-document",
  LEAVE_DOCUMENT: "leave-document",
  TEXT_UPDATE: "text-update",
  CURSOR_MOVE: "cursor-move",
} as const;
