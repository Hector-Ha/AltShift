import React, { useEffect, useState } from "react";
import { createEditor, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import { initialValue } from "./editorConfig";
import type { Socket } from "socket.io-client";

interface CustomEditorInterFace {
  socket: Socket;
}

export const CustomEditor: React.FC<CustomEditorInterFace> = ({ socket }) => {
  const [editor] = useState<Editor>(() => withReact(createEditor()));
  const [editorValue, setEditorValue] = useState(initialValue);

  useEffect(() => {
    socket.on("connect", () => {});

    return () => {
      socket.off("connect");
    };
  }, [socket]);

  return (
    <>
      <Slate editor={editor} initialValue={editorValue}>
        <Editable
          placeholder="Enter Your Text..."
          onKeyDown={(e) => console.log(e.key)}
        />
      </Slate>
    </>
  );
};
