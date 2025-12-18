import { Node } from "slate";

interface SlateElement {
  type: string;
  children: SlateNode[];
  [key: string]: any;
}

interface SlateText {
  text: string;
  [key: string]: any;
}

type SlateNode = SlateElement | SlateText;

export const markdownToSlate = (markdown: string): Node[] => {
  const nodes: SlateNode[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Headers
    if (line.match(/^#{1,6}\s/)) {
      const level = line.indexOf(" ");
      const text = line.slice(level + 1);
      const type =
        level === 1
          ? "heading-one"
          : level === 2
          ? "heading-two"
          : level === 3
          ? "heading-three"
          : level === 4
          ? "heading-four"
          : level === 5
          ? "heading-five"
          : "heading-six";

      nodes.push({ type, children: parseInline(text) });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      nodes.push({ type: "block-quote", children: parseInline(line.slice(2)) });
      i++;
      continue;
    }

    // Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      nodes.push({ type: "paragraph", children: [{ text: "---" }] });
      i++;
      continue;
    }

    // Code Block
    if (line.startsWith("```")) {
      i++;
      let codeContent = "";
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeContent += lines[i] + "\n";
        i++;
      }
      i++;
      nodes.push({
        type: "paragraph",
        children: [{ text: codeContent, code: true }],
      });
      continue;
    }

    // Tables
    if (line.startsWith("|")) {
      const headerRow = line
        .split("|")
        .filter((s) => s.trim() !== "")
        .map((s) => s.trim());

      if (headerRow.length > 0) {
        const table: SlateNode = { type: "table", children: [] };

        // Header
        table.children!.push({
          type: "table-row",
          children: headerRow.map((text) => ({
            type: "table-cell",
            children: parseInline(text),
          })),
        });

        i++;

        // Separator
        if (
          i < lines.length &&
          lines[i].trim().startsWith("|") &&
          lines[i].includes("-")
        ) {
          i++;
        }

        // Body
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          const cells = lines[i]
            .trim()
            .split("|")
            .filter((s) => s.trim() !== "")
            .map((s) => s.trim());
          table.children!.push({
            type: "table-row",
            children: cells.map((text) => ({
              type: "table-cell",
              children: parseInline(text),
            })),
          });
          i++;
        }
        nodes.push(table);
        continue;
      }
    }

    // Lists
    if (line.match(/^[-*]\s/)) {
      const list: SlateNode = { type: "bulleted-list", children: [] };
      while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
        const text = lines[i].trim().replace(/^[-*]\s+/, "");
        list.children!.push({
          type: "list-item",
          children: parseInline(text),
        });
        i++;
      }
      nodes.push(list);
      continue;
    }

    if (line.match(/^\d+\.\s/)) {
      const list: SlateNode = { type: "numbered-list", children: [] };
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        const text = lines[i].trim().replace(/^\d+\.\s+/, "");
        list.children!.push({
          type: "list-item",
          children: parseInline(text),
        });
        i++;
      }
      nodes.push(list);
      continue;
    }

    // Paragraph
    nodes.push({ type: "paragraph", children: parseInline(line) });
    i++;
  }

  // Ensure content
  if (nodes.length === 0) {
    return [
      { type: "paragraph", children: [{ text: "" }] },
    ] as unknown as Node[];
  }

  return nodes as unknown as Node[];
};

// Inline Parsing
const parseInline = (text: string): SlateNode[] => {
  let nodes: SlateNode[] = [{ text }];

  const applyMark = (
    pattern: RegExp,
    markKey: string,
    stripDelimiters: boolean = true
  ) => {
    const nextNodes: SlateNode[] = [];
    nodes.forEach((node) => {
      if (!node.text) {
        nextNodes.push(node);
        return;
      }
      if (node[markKey]) {
        nextNodes.push(node);
        return;
      }

      const parts = (node.text as string).split(pattern);
      parts.forEach((part, index) => {
        if (!part) return;

        if (index % 2 === 1) {
          let content = part;
          if (stripDelimiters) {
            if (markKey === "bold") content = part.slice(2, -2);
            else if (markKey === "italic") content = part.slice(1, -1);
            else if (markKey === "strikethrough") content = part.slice(2, -2);
            else if (markKey === "code") content = part.slice(1, -1);
          }
          nextNodes.push({ ...node, text: content, [markKey]: true });
        } else {
          nextNodes.push({ ...node, text: part });
        }
      });
    });
    nodes = nextNodes;
  };

  // Code
  applyMark(/(`[^`]+`)/g, "code");
  // Bold
  applyMark(/(\*\*[^*]+\*\*)/g, "bold");
  // Italic
  applyMark(/(\*[^*]+\*)/g, "italic");
  // Strikethrough
  applyMark(/(~~[^~]+~~)/g, "strikethrough");

  // Links
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linkNodes: SlateNode[] = [];

  nodes.forEach((node) => {
    if (
      !node.text ||
      node.bold ||
      node.italic ||
      node.code ||
      node.strikethrough
    ) {
      linkNodes.push(node);
      return;
    }

    let lastIndex = 0;
    let match;
    linkPattern.lastIndex = 0;

    while ((match = linkPattern.exec(node.text)) !== null) {
      const pre = node.text.slice(lastIndex, match.index);
      if (pre) linkNodes.push({ ...node, text: pre });

      const linkText = match[1];
      const linkUrl = match[2];

      linkNodes.push({
        type: "link",
        url: linkUrl,
        children: [{ text: linkText }],
      });

      lastIndex = linkPattern.lastIndex;
    }

    const post = node.text.slice(lastIndex);
    if (post) linkNodes.push({ ...node, text: post });
  });

  nodes = linkNodes;

  return nodes;
};
