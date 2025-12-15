import { Editor, Transforms, Element as SlateElement } from "slate";
import type { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  [key: string]: unknown;
};

export type ParagraphElement = {
  type:
    | "paragraph"
    | "block-quote"
    | "list-item"
    | "heading-one"
    | "heading-two"; // Grouping simple blocks for now to save space
  align?: string;
  children: CustomText[];
};

export type ListElement = {
  type: "bulleted-list" | "numbered-list";
  align?: string;
  children: ListItemElement[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type PageElement = {
  type: "page";
  children: (CustomElement | CustomText)[]; // Pages contain other blocks
};

// We need to break down CustomElement to allow for Pages that contain other Elements
export type CustomElement =
  | { type: "paragraph"; align?: string; children: CustomText[] }
  | { type: "heading-one"; align?: string; children: CustomText[] }
  | { type: "heading-two"; align?: string; children: CustomText[] }
  | { type: "block-quote"; align?: string; children: CustomText[] }
  | { type: "list-item"; children: CustomText[] }
  | { type: "bulleted-list"; align?: string; children: CustomElement[] }
  | { type: "numbered-list"; align?: string; children: CustomElement[] }
  | PageElement;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (
  editor: Editor,
  format: string,
  blockType = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format, "type");
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : (format as any),
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as any;
    Transforms.wrapNodes(editor, block);
  }
};
