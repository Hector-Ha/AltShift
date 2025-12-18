import React, { useMemo, useState, useCallback } from "react";
import { createEditor, type Descendant, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Paperclip, Send, File } from "lucide-react";
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
                  <File size={14} className="file-icon" />
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
            <Paperclip size={20} />
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
              <Send size={20} />
            )}
          </button>
        </div>
      </Slate>
    </div>
  );
};

export default RichTextPrompt;
