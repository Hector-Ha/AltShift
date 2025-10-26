import React from "react";
// import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { CustomEditor } from "./editor";
import { useSocket } from "../hooks/useSocket";

const socket = io("http://localhost:4000");

export const CollaborativeEditor: React.FC = () => {
  // const [connected, setConnected] = useState(false);

  useSocket(socket);

  return (
    <>
      <CustomEditor socket={socket} />
    </>
  );
};
