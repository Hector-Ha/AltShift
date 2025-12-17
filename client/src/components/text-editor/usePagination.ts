import { useLayoutEffect, useCallback } from "react";
import { Editor, Transforms, Node, Element as SlateElement } from "slate";
import { ReactEditor } from "slate-react";
import { createPageNode } from "./utils/pagination";

export const usePagination = (editor: Editor) => {
  const normalize = useCallback(() => {
    // Debounce normalization to avoid UI freezing
    setTimeout(() => {
      normalizePagination(editor);
    }, 50);
  }, [editor]);

  useLayoutEffect(() => {
    normalize();
  }, [editor.children, normalize]);
};

const normalizePagination = (editor: Editor) => {
  // Handle cascading overflows
  let contentMoved = true;
  let passes = 0;

  // Ensure editor is mounted and has content
  if (!ReactEditor.isFocused(editor) && editor.children.length === 0) return;

  Editor.withoutNormalizing(editor, () => {
    while (contentMoved && passes < 3) {
      contentMoved = false;
      passes++;

      const pages = document.querySelectorAll(".slate-page");

      // Iterate pages
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const pageDom = pages[pageIndex];
        const pageNode = Node.get(editor, [pageIndex]);

        if (!SlateElement.isElement(pageNode)) continue;

        // Check for overflow
        if (pageDom.scrollHeight > pageDom.clientHeight + 1) {
          // Overflow detected
          console.log(
            `Overflow on page ${pageIndex}`,
            pageDom.scrollHeight,
            pageDom.clientHeight
          );

          const children = pageNode.children;
          let splitIndex = -1;

          // Find split point
          for (let i = 0; i < children.length; i++) {
            const childNode = children[i];
            try {
              const domNode = ReactEditor.toDOMNode(editor, childNode);
              const pageRect = pageDom.getBoundingClientRect();
              const childRect = domNode.getBoundingClientRect();

              // Check if child exceeds page bottom
              const relativeTop = childRect.top - pageRect.top;

              if (relativeTop + childRect.height > pageDom.clientHeight) {
                splitIndex = i;
                break;
              }
            } catch (e) {
              // ignore
            }
          }

          if (splitIndex === -1 && children.length > 0) {
            // Fallback: move last child
            splitIndex = children.length - 1;
          }

          if (splitIndex !== -1) {
            const movePath = [pageIndex, splitIndex];
            const nextPagePath = [pageIndex + 1];

            // Create next page if needed
            if (!Node.has(editor, nextPagePath)) {
              Transforms.insertNodes(editor, createPageNode([]), {
                at: nextPagePath,
              });
            }

            // Move overflowing nodes to next page
            const count = children.length - splitIndex;

            // Prepend nodes to next page

            for (let k = 0; k < count; k++) {
              Transforms.moveNodes(editor, {
                at: movePath,
                to: [pageIndex + 1, k],
              });
            }

            contentMoved = true;
          }
        }
      }
    }
  });
};
