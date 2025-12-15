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
  // We use a loop to handle cascading overflows (Page 1 -> Page 2 -> Page 3)
  // We limit passes to prevent infinite loops in case of stabilization issues.
  let contentMoved = true;
  let passes = 0;
  const HEADER_HEIGHT = 0; // If any internal headers exist

  // We only run this if we can find the DOM nodes.
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
        // We use a small epsilon to avoid jitter
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
              // Check if child bottom is below page bottom
              // We must account for the page's relative position if nested,
              // but usually offsetTop is relative to the page content area if it's positioned.

              // Actually, let's look at the relative offset from the page container.
              const pageRect = pageDom.getBoundingClientRect();
              const childRect = domNode.getBoundingClientRect();

              // Relative top of child from page top
              const relativeTop = childRect.top - pageRect.top;

              // If the child's bottom exceeds the content height (clientHeight includes padding, so we compare against that?)
              // No, clientHeight is inner height relative to the box model.
              // .slate-page has padding.
              // The children are inside that padding.
              // So we shouldn't exceed clientHeight.

              if (relativeTop + childRect.height > pageDom.clientHeight) {
                splitIndex = i;
                break;
              }
            } catch (e) {
              // ignore
            }
          }

          // If no specific child found (e.g. big single child?), or splitIndex is 0 (entire first child doesn't fit?)
          // If splitIndex is 0, we can't move it to *next* page if we are already on a fresh page, that would be a loop for big elements.
          // But if we are on page 0, we can move to page 1.
          // We'll move it unless it's the ONLY child and it just doesn't fit (giant image?).
          // If it's 0, we move it, but if the next page is empty, we just moved it to same situation.
          // We can't split blocks yet. So we just let it overflow if it's the only one?
          // Or we accept it moves to the next page endlessly.
          // Let's assume text blocks are smaller than a page.

          if (splitIndex === -1 && children.length > 0) {
            // Fallback: move last child
            splitIndex = children.length - 1;
          }

          if (splitIndex !== -1) {
            // Perform move
            // If we are moving everything (index 0) and we are the last page, we stop?
            // No, we create a new page.

            // If we are moving everything from a page that is NOT the last page, we are just shifting blank pages?
            // That's a merge case. We ignore merges for now.

            const movePath = [pageIndex, splitIndex];
            const nextPagePath = [pageIndex + 1];

            // Create next page if needed
            if (!Node.has(editor, nextPagePath)) {
              Transforms.insertNodes(editor, createPageNode([]), {
                at: nextPagePath,
              });
            }

            // Move all nodes from splitIndex to end
            const count = children.length - splitIndex;

            // We move them one by one to the start of the next page so they end up PREPENDED before existing content on next page
            // (e.g. if page 2 had content, and page 1 overflows, the overflow should go BEFORE page 2 content).

            for (let k = 0; k < count; k++) {
              Transforms.moveNodes(editor, {
                at: movePath, // Always same path because subsequent nodes shift up
                to: [pageIndex + 1, k], // Insert at 0, 1, 2... of next page
              });
            }

            contentMoved = true;
          }
        }
      }
    }
  });
};
