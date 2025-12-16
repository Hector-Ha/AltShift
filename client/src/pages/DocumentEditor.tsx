import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { socket } from "../socket/socket";
import SlateEditor from "../components/text-editor/SlateEditor";
import "../styles/editor.css";
import ShareDropdown from "../components/ShareDropdown";
import { format } from "date-fns";

import { gql } from "../gql";
import type {
  GetDocumentQuery,
  GetDocumentQueryVariables,
  UpdateDocumentMutation,
  UpdateDocumentMutationVariables,
} from "../gql/graphql";

import type { ActiveUser } from "../socket/interfaces";

const GET_DOCUMENT = gql(`
  query GetDocument($id: ID!) {
    getDocumentByID(id: $id) {
      id
      title
      content
      visibility
      owner {
        id
      }
    }
  }
`);

const UPDATE_DOCUMENT = gql(`
  mutation UpdateDocument($id: ID!, $input: updateDocumentInput!) {
    updateDocument(documentID: $id, input: $input) {
      id
      content
    }
  }
`);

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const isLocalUpdate = useRef(false);

  // Auto-save & Status state
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Ref to track if content has changed since last save to avoid unnecessary saves
  const lastSavedContent = useRef<string>("");

  const { data, loading, error } = useQuery<
    GetDocumentQuery,
    GetDocumentQueryVariables
  >(GET_DOCUMENT, {
    variables: { id: id! },
  });

  useEffect(() => {
    if (data?.getDocumentByID) {
      if (data.getDocumentByID.content) {
        setContent(data.getDocumentByID.content ?? "");
        lastSavedContent.current = data.getDocumentByID.content ?? "";
      }
      if (data.getDocumentByID.title) {
        setTitle(data.getDocumentByID.title);
      }
    }
  }, [data]);

  const [saveDocument] = useMutation<
    UpdateDocumentMutation,
    UpdateDocumentMutationVariables
  >(UPDATE_DOCUMENT);

  const saveContent = useCallback(
    async (currentContent: string) => {
      if (!id) return;

      // Optimistic UI update
      setIsSaving(true);

      try {
        await saveDocument({
          variables: {
            id: id,
            input: { content: currentContent },
          },
        });
        setLastSaveTime(new Date());
        lastSavedContent.current = currentContent;
      } catch (err) {
        console.error("Failed to save:", err);
      } finally {
        // Small delay to let user see the "Cooking..." message briefly if it was fast
        setTimeout(() => {
          setIsSaving(false);
        }, 500);
      }
    },
    [id, saveDocument]
  );

  const handleTitleBlur = () => {
    if (data?.getDocumentByID && title !== data.getDocumentByID.title) {
      saveDocument({
        variables: {
          id: id!,
          input: { title },
        },
      });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // Triggers onBlur
    }
  };

  // Socket Connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Connect the singleton socket
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Connected to Socket");
      socket.emit("join-document", id!);
    };

    const onActiveUsers = (users: ActiveUser[]) => {
      setActiveUsers(users);
    };

    const onJoinDocument = (newUser: ActiveUser) => {
      setActiveUsers((prev) => {
        if (prev.find((u) => u.userId === newUser.userId)) return prev;
        return [...prev, newUser];
      });
    };

    const onTextUpdate = (operation: any) => {
      if (operation.content) {
        isLocalUpdate.current = true;
        setContent(operation.content);
        // Also update lastSavedContent to prevent overwriting remote changes with old local state on next auto-save
        // lastSavedContent.current = operation.content; // actually, auto-save should probably overwrite if we have pending changes, but here we just accept remote.
        // If we are typing, isLocalUpdate prevents us from emitting back.

        setTimeout(() => (isLocalUpdate.current = false), 100);
      }
    };

    socket.on("connect", onConnect);
    socket.on("active-users", onActiveUsers);
    socket.on("join-document", onJoinDocument);
    socket.on("text-update", onTextUpdate);

    // Initial join if already connected
    if (socket.connected) {
      socket.emit("join-document", id!);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("active-users", onActiveUsers);
      socket.off("join-document", onJoinDocument);
      socket.off("text-update", onTextUpdate);
      socket.disconnect();
    };
  }, [id, navigate]);

  // Auto Save
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if content is different from last save and we have content
      if (
        content &&
        content !== lastSavedContent.current &&
        !isLocalUpdate.current
      ) {
        saveContent(content);
      }
    }, 8000); // 8 seconds debounce

    return () => clearTimeout(timer);
  }, [content, saveContent]);

  // --- CTRL+S EFFECT ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveContent(content);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, saveContent]);

  const handleChange = (newContent: string) => {
    setContent(newContent);

    if (!isLocalUpdate.current && socket) {
      socket.emit("text-update", {
        documentId: id!,
        operation: { content: newContent },
      });
    }
  };

  const handleManualSave = () => {
    saveContent(content);
  };

  if (!id) return <div>Error: No Document ID provided</div>;
  if (loading) return <div>Loading Doc...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="editor-page">
      <div className="editor-main">
        <div className="editor-header">
          <div className="editor-title-container">
            <Link to="/dashboard" className="back-btn-link">
              <span className="material-icons back-icon">arrow_back</span>
            </Link>
            <input
              type="text"
              className="editor-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              placeholder="Untitled Document"
            />
          </div>

          <div className="editor-actions">
            <span className="save-status">
              {isSaving
                ? "Cooking Save Checkpoint..."
                : lastSaveTime
                ? `Last save ${format(lastSaveTime, "h:mm aa")}`
                : ""}
            </span>
            <button
              className="save-btn"
              onClick={handleManualSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            {data?.getDocumentByID && (
              <ShareDropdown
                documentId={id!}
                currentVisibility={data.getDocumentByID.visibility as any}
                isOwner={
                  data.getDocumentByID.owner?.id ===
                  localStorage.getItem("userId")
                }
              />
            )}
          </div>
        </div>

        <div className="editor-canvas">
          <SlateEditor initialContent={content} onChange={handleChange} />
        </div>
      </div>

      {/* Sidebar (Right) */}
      <div className="editor-sidebar">
        <div className="sidebar-header">Active Users</div>
        <div className="sidebar-content">
          <ul className="active-users-list">
            {activeUsers.map((u) => (
              <li key={u.socketId} className="active-user-item">
                <div
                  className="user-avatar"
                  style={{ backgroundColor: u.color }}
                >
                  {u.firstName?.[0] || u.email?.[0] || "?"}
                </div>
                <div className="user-info">
                  <div className="user-name">{u.firstName || "User"}</div>
                  <div className="user-email">{u.email}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
