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
  color?: string;
  backgroundColor?: string;
  [key: string]: unknown;
};

export type ParagraphElement = {
  type:
    | "paragraph"
    | "block-quote"
    | "list-item"
    | "heading-one"
    | "heading-two";
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
  children: (CustomElement | CustomText)[]; // Contains blocks
};

// Element types
export type CustomElement =
  | { type: "paragraph"; align?: string; children: CustomText[] }
  | { type: "heading-one"; align?: string; children: CustomText[] }
  | { type: "heading-two"; align?: string; children: CustomText[] }
  | { type: "heading-three"; align?: string; children: CustomText[] }
  | { type: "heading-four"; align?: string; children: CustomText[] }
  | { type: "heading-five"; align?: string; children: CustomText[] }
  | { type: "heading-six"; align?: string; children: CustomText[] }
  | { type: "block-quote"; align?: string; children: CustomText[] }
  | { type: "list-item"; children: CustomText[] }
  | { type: "bulleted-list"; align?: string; children: CustomElement[] }
  | { type: "numbered-list"; align?: string; children: CustomElement[] }
  | { type: "image"; url: string; children: CustomText[] }
  | { type: "video"; url: string; children: CustomText[] }
  | { type: "link"; url: string; children: CustomText[] }
  | { type: "table"; children: TableRowElement[] }
  | { type: "table-row"; children: TableCellElement[] }
  | { type: "table-cell"; children: CustomText[] }
  | PageElement;

export type TableRowElement = {
  type: "table-row";
  children: TableCellElement[];
};

export type TableCellElement = {
  type: "table-cell";
  children: CustomText[];
};

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

export const toggleAlign = (editor: Editor, align: string) => {
  const isActive = isBlockActive(editor, align, "align");

  Transforms.setNodes(
    editor,
    { align: isActive ? undefined : align } as Partial<CustomElement>,
    { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
  );
};
