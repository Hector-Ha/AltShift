import { Editor, Transforms, Element as SlateElement } from "slate";

export const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" || element.type === "video"
      ? true
      : isVoid(element);
  };

  return editor;
};

export const insertImage = (editor: Editor, url: string) => {
  const text = { text: "" };
  const image: SlateElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

export const insertVideo = (editor: Editor, url: string) => {
  const text = { text: "" };
  const video: SlateElement = { type: "video", url, children: [text] };
  Transforms.insertNodes(editor, video);
};
