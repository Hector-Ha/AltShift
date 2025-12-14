import React from "react";
import { useSlate } from "slate-react";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";

const Button = React.forwardRef<
  HTMLSpanElement,
  {
    active: boolean;
    reversed: boolean;
    onMouseDown: (event: React.MouseEvent) => void;
    children: React.ReactNode;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
  }
>(({ className, active, reversed, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    style={{
      cursor: "pointer",
      color: reversed ? (active ? "white" : "#aaa") : active ? "black" : "#ccc",
      padding: "5px",
      margin: "0 5px",
      display: "inline-block",
      fontWeight: active ? "bold" : "normal",
      ...((props as any).style || {}),
    }}
  />
));

const Icon = React.forwardRef<
  HTMLSpanElement,
  { children: React.ReactNode; className?: string }
>(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={`material-icons ${className}`}
    style={{ fontSize: "18px", verticalAlign: "text-bottom" }}
  />
));

const BlockButton = ({
  format,
  icon,
  title,
}: {
  format: string;
  icon: string;
  title?: string;
}) => {
  const editor = useSlate();
  const active = isBlockActive(editor, format);

  return (
    <Button
      active={active}
      reversed={false}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      title={title || format}
      style={{
        backgroundColor: active ? "#e2e8f0" : "transparent",
        borderRadius: "4px",
        padding: "4px 8px",
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({
  format,
  icon,
  title,
}: {
  format: string;
  icon: string;
  title?: string;
}) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <Button
      active={active}
      reversed={false}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      title={title || format}
      style={{
        backgroundColor: active ? "#e2e8f0" : "transparent",
        borderRadius: "4px",
        padding: "4px 8px",
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export const Toolbar = () => {
  return (
    <div
      style={{
        borderBottom: "2px solid #eee",
        padding: "10px 18px 10px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        alignItems: "center",
      }}
    >
      <MarkButton format="bold" icon="B" title="Bold" />
      <MarkButton format="italic" icon="I" title="Italic" />
      <MarkButton format="underline" icon="U" title="Underline" />
      <MarkButton format="code" icon="<>" title="Code" />
      <span
        style={{ width: "1px", background: "#ccc", margin: "0 10px" }}
      ></span>
      <BlockButton format="heading-one" icon="H1" title="Heading 1" />
      <BlockButton format="heading-two" icon="H2" title="Heading 2" />
      <BlockButton format="block-quote" icon="“" title="Quote" />
      <BlockButton format="numbered-list" icon="1." title="Numbered List" />
      <BlockButton format="bulleted-list" icon="•" title="Bulleted List" />
    </div>
  );
};
