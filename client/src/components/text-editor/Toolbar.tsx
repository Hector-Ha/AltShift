import React from "react";
import { useSlate } from "slate-react";
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  toggleAlign,
} from "./utils";
import { Dropdown } from "./components/Dropdown";
import { ColorPicker } from "./components/ColorPicker";
import { insertImage, insertVideo } from "./plugins/withImages";
import { insertLink } from "./plugins/withLinks";
import { insertTable } from "./plugins/withTables";
import { Sparkles } from "lucide-react";
import AIToolbarPopup from "./components/AIToolbarPopup";

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

const AlignButton = ({
  format,
  icon,
  title,
}: {
  format: string;
  icon: string;
  title?: string;
}) => {
  const editor = useSlate();
  const active = isBlockActive(editor, format, "align");

  return (
    <Button
      active={active}
      reversed={false}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleAlign(editor, format);
      }}
      title={title || format}
      className={`toolbar-btn ${active ? "active" : ""}`}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export const Toolbar = () => {
  const editor = useSlate();

  const handleInsertImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      insertImage(editor, url);
    }
  };

  const handleInsertVideo = () => {
    const url = window.prompt("Enter the URL of the video:");
    if (url) {
      insertVideo(editor, url);
    }
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter the URL of the link:");
    if (url) {
      insertLink(editor, url);
    }
  };

  const [isAIOpen, setIsAIOpen] = React.useState(false);

  return (
    <div className="slate-toolbar">
      {/* History */}
      {/* <span className="toolbar-group">
        <Button
          active={false}
          reversed={false}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.undo();
          }}
          title="Undo"
        >
          <Icon>undo</Icon>
        </Button>
        <Button
          active={false}
          reversed={false}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.redo();
          }}
          title="Redo"
        >
          <Icon>redo</Icon>
        </Button>
      </span> 
      <span className="toolbar-separator"></span> */}

      {/* AI Assistant */}
      <span className="toolbar-group" style={{ position: "relative" }}>
        <Button
          active={isAIOpen}
          reversed={false}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsAIOpen(!isAIOpen);
          }}
          title="AI Assistant"
          className={`toolbar-btn ${isAIOpen ? "active" : ""}`}
          style={{ color: isAIOpen ? "var(--primary-color)" : "inherit" }}
        >
          <Sparkles size={18} />
        </Button>
        <AIToolbarPopup isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </span>

      <span className="toolbar-separator"></span>

      {/* Formatting */}
      <span className="toolbar-group">
        <Dropdown icon="text_fields" title="Text Style">
          <BlockButton format="paragraph" icon="short_text" title="Normal" />
          <BlockButton
            format="heading-one"
            icon="looks_one"
            title="Heading 1"
          />
          <BlockButton
            format="heading-two"
            icon="looks_two"
            title="Heading 2"
          />
          <BlockButton
            format="heading-three"
            icon="looks_3"
            title="Heading 3"
          />
          <BlockButton format="heading-four" icon="looks_4" title="Heading 4" />
          <BlockButton format="heading-five" icon="looks_5" title="Heading 5" />
          <BlockButton format="heading-six" icon="looks_6" title="Heading 6" />
          <BlockButton format="block-quote" icon="format_quote" title="Quote" />
          <BlockButton format="code-block" icon="code" title="Code Block" />
        </Dropdown>
      </span>

      <span className="toolbar-separator"></span>

      {/* Basic Marks */}
      <span className="toolbar-group">
        <MarkButton format="bold" icon="format_bold" title="Bold" />
        <MarkButton format="italic" icon="format_italic" title="Italic" />
        <MarkButton
          format="underline"
          icon="format_underlined"
          title="Underline"
        />
        <MarkButton
          format="strikethrough"
          icon="strikethrough_s"
          title="Strikethrough"
        />
        <MarkButton format="code" icon="code" title="Inline Code" />
      </span>

      <span className="toolbar-separator"></span>

      {/* Alignment */}
      <span className="toolbar-group">
        <Dropdown icon="format_align_left" title="Alignment">
          <AlignButton format="left" icon="format_align_left" title="Left" />
          <AlignButton
            format="center"
            icon="format_align_center"
            title="Center"
          />
          <AlignButton format="right" icon="format_align_right" title="Right" />
          <AlignButton
            format="justify"
            icon="format_align_justify"
            title="Justify"
          />
        </Dropdown>
      </span>

      <span className="toolbar-separator"></span>

      {/* Lists */}
      <span className="toolbar-group">
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
      </span>

      <span className="toolbar-separator"></span>

      {/* Insert */}
      <span className="toolbar-group">
        <Dropdown icon="add_circle_outline" title="Insert">
          <Button
            active={false}
            reversed={false}
            onMouseDown={(e) => {
              e.preventDefault();
              handleInsertImage();
            }}
            title="Image"
            className="toolbar-btn"
          >
            <Icon>image</Icon>
          </Button>
          <Button
            active={false}
            reversed={false}
            onMouseDown={(e) => {
              e.preventDefault();
              handleInsertVideo();
            }}
            title="Video"
            className="toolbar-btn"
          >
            <Icon>movie</Icon>
          </Button>
          <Button
            active={false}
            reversed={false}
            onMouseDown={(e) => {
              e.preventDefault();
              handleInsertLink();
            }}
            title="Link"
            className="toolbar-btn"
          >
            <Icon>link</Icon>
          </Button>
          <Button
            active={false}
            reversed={false}
            onMouseDown={(e) => {
              e.preventDefault();
              insertTable(editor);
            }}
            title="Table"
            className="toolbar-btn"
          >
            <Icon>table_view</Icon>
          </Button>
        </Dropdown>
      </span>

      <span className="toolbar-separator"></span>

      {/* Colors */}
      <span className="toolbar-group">
        <ColorPicker
          format="color"
          icon="format_color_text"
          title="Text Color"
        />
        <ColorPicker
          format="backgroundColor"
          icon="format_color_fill"
          title="Background Color"
        />
      </span>
    </div>
  );
};
