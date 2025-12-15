interface SlateNode {
  type?: string;
  children: SlateNode[];
  text?: string;
  [key: string]: any;
}

export const markdownToSlate = (markdown: string): SlateNode[] => {
  const nodes: SlateNode[] = [];
  const lines = markdown.split("\n");
  let currentList: SlateNode | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Headings
    if (line.startsWith("# ")) {
      currentList = null;
      nodes.push({
        type: "heading-one",
        children: [{ text: line.replace("# ", "") }],
      });
    } else if (line.startsWith("## ")) {
      currentList = null;
      nodes.push({
        type: "heading-two",
        children: [{ text: line.replace("## ", "") }],
      });
    }
    // Blockquote
    else if (line.startsWith("> ")) {
      currentList = null;
      nodes.push({
        type: "block-quote",
        children: [{ text: line.replace("> ", "") }],
      });
    }
    // Lists
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.replace(/^[-*]\s+/, "");

      if (!currentList || currentList.type !== "bulleted-list") {
        currentList = {
          type: "bulleted-list",
          children: [],
        };
        nodes.push(currentList);
      }

      currentList.children.push({
        type: "list-item",
        children: [{ text }],
      });
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s+/, "");

      if (!currentList || currentList.type !== "numbered-list") {
        currentList = {
          type: "numbered-list",
          children: [],
        };
        nodes.push(currentList);
      }

      currentList.children.push({
        type: "list-item",
        children: [{ text }],
      });
    }
    // Default Paragraph
    else {
      currentList = null;
      // Basic inline formatting
      const children = parseInline(line);
      nodes.push({
        type: "paragraph",
        children: children,
      });
    }
  }

  return nodes;
};

// Simple inline parser for bold and italic
const parseInline = (text: string): SlateNode[] => {
  const children: SlateNode[] = [];

  const parts = text.split(/(\*\*.*?\*\*)/g);

  parts.forEach((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      children.push({ text: part.slice(2, -2), bold: true });
    } else {
      // Italic: *italic* (only if not bold)
      const subParts = part.split(/(\*.*?\*)/g);
      subParts.forEach((subPart) => {
        if (
          subPart.startsWith("*") &&
          subPart.endsWith("*") &&
          subPart.length > 2
        ) {
          children.push({ text: subPart.slice(1, -1), italic: true });
        } else if (subPart) {
          children.push({ text: subPart });
        }
      });
    }
  });

  return children;
};
