import React, { useCallback, useMemo, useEffect, useState } from "react";
import { createEditor } from "slate";
import type { Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { withHistory } from "slate-history";
import { Toolbar } from "./Toolbar";

interface SlateEditorProps {
  initialContent?: string; // JSON string or plain text
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as any).align };
  switch (element.type) {
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
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  // Ref to track current value for comparison to prevent focus loss
  const valueRef = React.useRef<Descendant[]>([]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);

        // Check if content matches current state to avoid re-render loop/focus loss
        const currentContentString = JSON.stringify(valueRef.current);
        if (currentContentString === initialContent) {
          return;
        }

        if (Array.isArray(parsed)) {
          setValue(parsed);
          editor.children = parsed;
          // Do NOT reset selection here to preserve focus on updates
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
        {/* WE keep flex:1 to fill the paper if needed */}
        <div style={{ flex: 1 }}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Type your document..."
            spellCheck
            autoFocus
            readOnly={readOnly}
            className="slate-editable"
            style={{ minHeight: "600px" }}
          />
        </div>
      </div>
    </Slate>
  );
};

export default SlateEditor;
