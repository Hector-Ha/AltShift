import { Editor, Element as SlateElement, Transforms, Node } from "slate";
import { createPageNode } from "../utils/pagination";

export const withPagination = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Root normalization
    if (path.length === 0) {
      if (editor.children.length < 1) {
        // Ensure page
        const page = createPageNode();
        Transforms.insertNodes(editor, page, { at: [0] });
        return;
      }

      // Check root children
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!SlateElement.isElement(child) || child.type !== "page") {
          // Wrap in page
          Transforms.wrapNodes(editor, createPageNode([]), { at: childPath });
          return;
        }
      }
    }

    // Page normalization
    if (SlateElement.isElement(node) && node.type === "page") {
      // Ensure page content
      if (node.children.length === 0) {
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
          { at: path.concat(0) }
        );
        return;
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
