import React, { useCallback, useMemo, useEffect, useState } from "react";
import { createEditor } from "slate";
import type { Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { withHistory } from "slate-history";
import { Toolbar } from "./Toolbar";
import { usePagination } from "./usePagination";
import { withPagination } from "./plugins/withPagination";
import { withImages } from "./plugins/withImages";
import { withLinks } from "./plugins/withLinks";
import { withTables } from "./plugins/withTables";

import "../../styles/SlateEditor.css"; // Import the new styles

interface SlateEditorProps {
  initialContent?: string; // JSON string or plain text
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as any).align };
  switch (element.type) {
    case "page":
      return (
        <div className="slate-page" {...attributes}>
          {children}
        </div>
      );
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      );
    case "image":
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <img
              src={(element as any).url}
              alt="img"
              className="slate-image-wrapper"
            />
          </div>
          {children}
        </div>
      );
    case "video":
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <video
              src={(element as any).url}
              controls
              className="slate-video-wrapper"
            />
          </div>
          {children}
        </div>
      );
    case "link":
      return (
        <a {...attributes} href={(element as any).url} className="slate-link">
          {children}
        </a>
      );
    case "table":
      return (
        <table className="slate-table" {...attributes}>
          <tbody style={style}>{children}</tbody>
        </table>
      );
    case "table-row":
      return (
        <tr style={style} {...attributes}>
          {children}
        </tr>
      );
    case "table-cell":
      return (
        <td style={style} {...attributes}>
          {children}
        </td>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }
  if (leaf.backgroundColor) {
    children = (
      <span style={{ backgroundColor: leaf.backgroundColor }}>{children}</span>
    );
  }

  return <span {...attributes}>{children}</span>;
};

const SlateEditor: React.FC<SlateEditorProps> = ({
  initialContent,
  onChange,
  readOnly,
}) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () =>
      withTables(
        withLinks(
          withImages(withPagination(withHistory(withReact(createEditor()))))
        )
      ),
    []
  );

  const [value, setValue] = useState<Descendant[]>([
    {
      type: "page",
      children: [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
    },
  ]);

  // Track value to prevent focus loss
  const valueRef = React.useRef<Descendant[]>([]);

  usePagination(editor);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);

        // Avoid re-render loop
        const currentContentString = JSON.stringify(valueRef.current);
        if (currentContentString === initialContent) {
          return;
        }

        if (Array.isArray(parsed)) {
          setValue(parsed);
          editor.children = parsed;
          setValue(parsed);
          editor.children = parsed;
        }
      } catch (e) {
        console.error("Invalid slate content", e);
      }
    }
  }, [initialContent, editor]);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    if (onChange) {
      onChange(JSON.stringify(newValue));
    }
  };

  return (
    <Slate editor={editor} initialValue={value} onChange={handleChange}>
      <div className="slate-editor-wrapper">
        {!readOnly && <Toolbar />}
        {/* Keep flex:1 to fill the paper if needed */}
        <div className="slate-editor-flex-container">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Type your document..."
            spellCheck
            autoFocus
            readOnly={readOnly}
            className="slate-editable slate-editable-content"
          />
        </div>
      </div>
    </Slate>
  );
};

export default SlateEditor;
