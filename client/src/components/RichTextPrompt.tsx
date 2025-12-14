import React, { useMemo, useState, useCallback } from "react";
import { createEditor, type Descendant, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

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
            className="slate-editable"
            placeholder={placeholder || "Type here..."}
            onKeyDown={handleKeyDown}
            readOnly={loading}
            style={{
              minHeight: "80px",
              padding: "12px",
              outline: "none",
              color: "#334155",
            }}
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
            style={{ display: "none" }}
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

      <style>{`
        .rich-text-prompt-container {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            transition: all 0.2s;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        .rich-text-prompt-container:focus-within {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px -1px rgba(59, 130, 246, 0.15);
        }
        .editor-wrapper {
            flex: 1;
            cursor: text;
        }
        .attachments-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 0 12px 12px 12px;
        }
        .attachment-chip {
            background: #f1f5f9;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            color: #475569;
        }
        .remove-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #94a3b8;
            font-size: 14px;
            padding: 0;
            display: flex;
            align-items: center;
        }
        .remove-btn:hover {
            color: #ef4444;
        }
        .slate-editable:empty:before {
            content: attr(placeholder);
            color: #94a3b8;
            pointer-events: none;
            display: block; /* For Firefox */
        }
        
        .prompt-actions {
            display: flex;
            justify-content: flex-end;
            padding: 8px 12px;
            gap: 8px;
            border-top: 1px solid #f1f5f9;
            background: #f8fafc;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }
        .action-btn {
            background: transparent;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            color: #64748b;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .action-btn:hover:not(:disabled) {
            background: #e2e8f0;
            color: #334155;
        }
        .send-btn {
            background: #3b82f6;
            color: white;
        }
        .send-btn:hover:not(:disabled) {
            background: #2563eb;
            color: white;
        }
        .send-btn:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default RichTextPrompt;
