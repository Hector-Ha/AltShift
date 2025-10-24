import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { Descendant } from "slate";

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
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Initial Values for Slate
export const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];
