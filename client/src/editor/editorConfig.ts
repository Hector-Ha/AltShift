import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { Descendant } from "slate";
import type { Socket } from "socket.io-client";

// Custom Slate Module
declare module "slate" {
  interface CustomElement {
    type: "paragraph";
    children: Descendant[];
  }

  interface CustomText {
    text: string;
    bold?: boolean;
    italic?: boolean;
  }

  interface CustomTypes {
    socket: Socket;
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Initial Values for Slate
export const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
