import React, { useState } from "react";
import { createEditor, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import { initialValue } from "./editorConfig";

export const CustomEditor: React.FC = () => {
  const [editor] = useState<Editor>(() => withReact(createEditor()));

  return (
    <>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
      </Slate>
    </>
  );
};
