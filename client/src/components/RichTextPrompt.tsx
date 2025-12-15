import React, { useMemo, useState, useCallback } from "react";
import { createEditor, type Descendant, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import "../styles/RichTextPrompt.css";

interface Attachment {
  name: string;
  content: string; // Base64
  mimeType: string;
}

interface RichTextPromptProps {
  onSubmit: (text: string, attachments: Attachment[]) => void;
  loading?: boolean;
  placeholder?: string;
}

const RichTextPrompt: React.FC<RichTextPromptProps> = ({
  onSubmit,
  loading,
  placeholder,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Initial value
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  const [value, setValue] = useState<Descendant[]>(initialValue);

  // Serialize to plain text for submission
  const serialize = (nodes: Descendant[]) => {
    return nodes.map((n) => Node.string(n)).join("\n");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newAttachments: Attachment[] = [];

      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          alert(`File ${file.name} is too large (max 2MB).`);
          continue;
        }

        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            newAttachments.push({
              name: file.name,
              content: base64,
              mimeType: file.type,
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = useCallback(() => {
    const text = serialize(value);
    if (!text.trim() && attachments.length === 0) return;

    onSubmit(text, attachments);

    // Reset
    editor.children = [{ type: "paragraph", children: [{ text: "" }] }];
    editor.onChange();
    setValue([{ type: "paragraph", children: [{ text: "" }] }]);
    setAttachments([]);
  }, [value, attachments, onSubmit, editor]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rich-text-prompt-container">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(val) => setValue(val)}
      >
        <div className="editor-wrapper">
          <Editable
            className="slate-editable rich-text-editable-content"
            placeholder={placeholder || "Type here..."}
            onKeyDown={handleKeyDown}
            readOnly={loading}
          />
          {attachments.length > 0 && (
            <div className="attachments-list">
              {attachments.map((file, i) => (
                <div key={i} className="attachment-chip">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(i)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="prompt-actions">
          <input
            type="file"
            ref={fileInputRef}
            className="file-input-hidden"
            multiple
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileSelect}
          />
          <button
            className="action-btn attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>
          <button
            className="action-btn send-btn"
            onClick={handleSubmit}
            disabled={
              loading || (!serialize(value).trim() && attachments.length === 0)
            }
            title="Send"
          >
            {loading ? (
              <span className="spinner">...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </Slate>
    </div>
  );
};

export default RichTextPrompt;
