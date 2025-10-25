import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { CustomEditor } from "./editor";

const socket = io("http://localhost:4000");

export const CollaborativeEditor: React.FC = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Client is on Socket: ${socket.id}`);
      setConnected(() => !connected);
    });

    socket.on("disconnect", () => {
      console.log(`Client is disconnected`);
      setConnected(() => !connected);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      <CustomEditor socket={socket} />
    </>
  );
};
