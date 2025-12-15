import type { PageElement } from "../utils";

export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;
export const PAGE_MARGIN = 96;
export const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_MARGIN * 2;

export const createPageNode = (
  children: any[] = [{ type: "paragraph", children: [{ text: "" }] }]
): PageElement => ({
  type: "page",
  children,
});
