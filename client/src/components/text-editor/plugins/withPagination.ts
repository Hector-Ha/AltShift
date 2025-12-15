import { Editor, Element as SlateElement, Transforms, Node } from "slate";
import { createPageNode } from "../utils/pagination";

export const withPagination = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Root level normalization
    if (path.length === 0) {
      if (editor.children.length < 1) {
        // Ensure at least one page exists
        const page = createPageNode();
        Transforms.insertNodes(editor, page, { at: [0] });
        return;
      }

      // Check for non-page children at root
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!SlateElement.isElement(child) || child.type !== "page") {
          // Wrap non-page nodes in a page
          Transforms.wrapNodes(editor, createPageNode([]), { at: childPath });
          return;
        }
      }
    }

    // Page level normalization
    if (SlateElement.isElement(node) && node.type === "page") {
      // Ensure page is not empty (must have at least one child)
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
