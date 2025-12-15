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
  <span {...props} ref={ref} className={className} />
));

const Icon = React.forwardRef<
  HTMLSpanElement,
  { children: React.ReactNode; className?: string }
>(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={`material-icons ${className} toolbar-icon`}
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
      className={`toolbar-btn ${active ? "active" : ""}`}
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
      className={`toolbar-btn ${active ? "active" : ""}`}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export const Toolbar = () => {
  return (
    <div className="slate-toolbar">
      <MarkButton format="bold" icon="format_bold" title="Bold" />
      <MarkButton format="italic" icon="format_italic" title="Italic" />
      <MarkButton
        format="underline"
        icon="format_underlined"
        title="Underline"
      />
      <MarkButton format="code" icon="code" title="Code" />
      <span className="toolbar-separator"></span>
      <BlockButton format="heading-one" icon="looks_one" title="Heading 1" />
      <BlockButton format="heading-two" icon="looks_two" title="Heading 2" />
      <BlockButton format="block-quote" icon="format_quote" title="Quote" />
      <BlockButton
        format="numbered-list"
        icon="format_list_numbered"
        title="Numbered List"
      />
      <BlockButton
        format="bulleted-list"
        icon="format_list_bulleted"
        title="Bulleted List"
      />
    </div>
  );
};
