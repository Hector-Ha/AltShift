import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Sparkles, X } from "lucide-react";
import RichTextPrompt from "../../RichTextPrompt";
import { useSlate } from "slate-react";
import { Transforms, Node } from "slate";
import { markdownToSlate } from "../markdownToSlate";

const GENERATE_AI_CONTENT = gql(`
  mutation GenerateAIContent($prompt: String!, $context: String!) {
    generateAIContent(prompt: $prompt, context: $context)
  }
`);

interface AIToolbarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIToolbarPopup: React.FC<AIToolbarPopupProps> = ({ isOpen, onClose }) => {
  const editor = useSlate();
  const [generateAIContent, { loading }] = useMutation<{
    generateAIContent: string;
  }>(GENERATE_AI_CONTENT);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (text: string, _attachments: any[]) => {
    setError(null);
    try {
      // Serialize full document as default context
      const fullDocContext = editor.children
        .map((n) => Node.string(n))
        .join("\n");
      let context = fullDocContext;

      // If user has selected text, use that as context instead
      const selectedText = window.getSelection()?.toString() || "";
      if (selectedText.trim().length > 0) {
        context = selectedText;
      }

      console.log("Sending AI Context:", context.substring(0, 100) + "..."); // Debug

      const { data } = await generateAIContent({
        variables: {
          prompt: text,
          context: context,
        },
      });

      if (data?.generateAIContent) {
        // Parse markdown to nodes
        try {
          const nodes = markdownToSlate(data.generateAIContent);
          // Insert nodes
          Transforms.insertNodes(editor, nodes);
        } catch (e) {
          console.error("Error parsing markdown to slate:", e);
          // Fallback to text insertion
          Transforms.insertText(editor, data.generateAIContent);
        }
        onClose();
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(err.message || "Failed to generate content");
    }
  };

  return (
    <div
      className="ai-toolbar-popup"
      style={{
        position: "absolute",
        bottom: "100%",
        left: "0",
        marginBottom: "10px",
        zIndex: 1000,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        padding: "12px",
        width: "350px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Sparkles size={16} /> AI Assistant
        </h4>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {error && <div style={{ color: "red", fontSize: "12px" }}>{error}</div>}

      <RichTextPrompt
        onSubmit={handleSubmit}
        loading={loading}
        placeholder="Ask AI to write something..."
      />
    </div>
  );
};

export default AIToolbarPopup;
