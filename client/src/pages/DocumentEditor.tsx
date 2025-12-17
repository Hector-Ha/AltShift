import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { socket } from "../socket/socket";
import SlateEditor from "../components/text-editor/SlateEditor";
import "../styles/editor.css";
import ShareDialog from "../components/ShareDialog";
import ArchiveModal from "../components/ArchiveModal";
import { format, differenceInDays } from "date-fns";

import { gql } from "../gql";
import type {
  GetDocumentQuery,
  GetDocumentQueryVariables,
} from "../gql/graphql";

import type { ActiveUser } from "../socket/interfaces";

const GET_DOCUMENT = gql(`
  query GetDocument($id: ID!) {
    getDocumentByID(id: $id) {
      id
      title
      content
      visibility
      isArchived
      scheduledDeletionTime
      archiveType
      owner {
        id
        email
        personalInformation {
          firstName
          lastName
        }
      }
      collaborators {
        id
        email
        personalInformation {
          firstName
          lastName
        }
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

const ARCHIVE_DOCUMENT = gql(`
  mutation ArchiveDocument($documentID: ID!, $type: ArchiveType!, $removeCollaborators: Boolean!) {
    archiveDocument(documentID: $documentID, type: $type, removeCollaborators: $removeCollaborators) {
      id
      isArchived
      scheduledDeletionTime
    }
  }
`);

const UNARCHIVE_DOCUMENT = gql(`
  mutation UnarchiveDocument($documentID: ID!) {
    unarchiveDocument(documentID: $documentID) {
      id
      isArchived
    }
  }
`);

const CANCEL_SCHEDULED_DELETION = gql(`
  mutation CancelScheduledDeletion($documentID: ID!) {
    cancelScheduledDeletion(documentID: $documentID) {
      id
      scheduledDeletionTime
      archiveType
    }
  }
`);

const DELETE_DOCUMENT_IMMEDIATELY = gql(`
  mutation DeleteDocumentImmediately($documentID: ID!) {
    deleteDocumentImmediately(documentID: $documentID)
  }
`);

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const isLocalUpdate = useRef(false);

  // Auto-save
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedContent = useRef<string>("");

  // Archive State
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<
    GetDocumentQuery,
    GetDocumentQueryVariables
  >(GET_DOCUMENT, {
    variables: { id: id! },
  });

  const isArchived = data?.getDocumentByID?.isArchived;
  const scheduledDeletionTime = data?.getDocumentByID?.scheduledDeletionTime;
  const isOwner =
    data?.getDocumentByID?.owner?.id === localStorage.getItem("userId");

  // Document mutations
  const [saveDocument] = useMutation(UPDATE_DOCUMENT);
  const [archiveMock] = useMutation(ARCHIVE_DOCUMENT);
  const [unarchive] = useMutation(UNARCHIVE_DOCUMENT);
  const [cancelDeletion] = useMutation(CANCEL_SCHEDULED_DELETION);
  const [hardDelete] = useMutation(DELETE_DOCUMENT_IMMEDIATELY);
  // Invite & Share State
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Collaborators
  const [collaboratorList, setCollaboratorList] = useState<any[]>([]);

  useEffect(() => {
    if (data?.getDocumentByID) {
      const doc = data.getDocumentByID;
      const owner = doc.owner;
      const collabs = doc.collaborators || [];

      // Combine owner + collaborators
      const allUsers = [
        { ...owner, isOwner: true },
        ...collabs.map((c) => ({ ...c, isOwner: false })),
      ];

      // Merge collaborators with active status
      const merged = allUsers.map((u) => {
        const active = activeUsers.find((au) => au.userId === u.id);
        return {
          ...u,
          isActive: !!active,
          color: active?.color || stringToColor(u.email), // Fallback color gen
          socketId: active?.socketId,
        };
      });

      // Include guest users
      const guests = activeUsers.filter(
        (au) => !allUsers.find((u) => u.id === au.userId)
      );
      const guestDocs = guests.map((g) => ({
        id: g.userId,
        email: g.email,
        personalInformation: { firstName: g.firstName || "Guest" },
        isOwner: false,
        isActive: true,
        color: g.color,
        socketId: g.socketId,
      }));

      setCollaboratorList([...merged, ...guestDocs]);
    }
  }, [data, activeUsers]);

  // Generate color from string
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };

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

  const saveContent = useCallback(
    async (currentContent: string) => {
      if (!id || isArchived) return;

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
        setTimeout(() => {
          setIsSaving(false);
        }, 500);
      }
    },
    [id, saveDocument, isArchived]
  );

  const handleTitleBlur = () => {
    if (isArchived) return;
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
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

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
        setTimeout(() => (isLocalUpdate.current = false), 100);
      }
    };

    socket.on("connect", onConnect);
    socket.on("active-users", onActiveUsers);
    socket.on("join-document", onJoinDocument);
    socket.on("text-update", onTextUpdate);

    if (socket.connected) {
      socket.emit("join-document", id!);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("active-users", onActiveUsers);
      socket.off("join-document", onJoinDocument);
      socket.off("text-update", onTextUpdate);
    };
  }, [id, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        content &&
        content !== lastSavedContent.current &&
        !isLocalUpdate.current &&
        !isArchived
      ) {
        saveContent(content);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [content, saveContent, isArchived]);

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
    if (isArchived) return;
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

  const handleArchiveConfirm = async (
    removeCollaborators: boolean,
    scheduleDeletion: boolean
  ) => {
    try {
      await archiveMock({
        variables: {
          documentID: id!,
          type: scheduleDeletion ? "SCHEDULED" : "MANUAL",
          removeCollaborators,
        },
      });
      refetch();
    } catch (err) {
      alert("Error archiving: " + err);
    }
  };

  const handleRestore = async () => {
    try {
      await unarchive({
        variables: { documentID: id! },
      });
      refetch();
    } catch (err) {
      alert("Error restoring: " + err);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      await cancelDeletion({
        variables: { documentID: id! },
      });
      refetch();
    } catch (err) {
      alert("Error canceling deletion: " + err);
    }
  };

  const handleHardDelete = async () => {
    if (
      confirm(
        "Are you sure you want to permanently delete this document? This cannot be undone."
      )
    ) {
      try {
        await hardDelete({
          variables: { documentID: id! },
        });
        navigate("/dashboard");
      } catch (err) {
        alert("Error deleting: " + err);
      }
    }
  };

  if (!id) return <div>Error: No Document ID provided</div>;
  if (loading) return <div>Loading Doc...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.getDocumentByID) {
    return (
      <div className="editor-error-page">
        <h2>Document Not Found</h2>
        <p>This document may have been deleted or does not exist.</p>
        <Link to="/dashboard" className="save-btn editor-error-link">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <ArchiveModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchiveConfirm}
        title={title}
      />

      <div className="editor-main">
        {isArchived && (
          <div
            className={`archive-banner ${
              scheduledDeletionTime ? "banner-warning" : "banner-info"
            }`}
          >
            <div className="banner-content">
              <span className="material-icons">archive</span>
              <span>
                This document is archived and read-only.
                {scheduledDeletionTime && (
                  <>
                    {" "}
                    Scheduled for deletion in{" "}
                    <strong>
                      {differenceInDays(
                        new Date(scheduledDeletionTime),
                        new Date()
                      )}{" "}
                      days
                    </strong>{" "}
                    ({format(new Date(scheduledDeletionTime), "MMM d, yyyy")}).
                  </>
                )}
              </span>
            </div>
            <div className="banner-actions">
              {isOwner && (
                <>
                  {scheduledDeletionTime && (
                    <button
                      className="banner-btn"
                      onClick={handleCancelDeletion}
                    >
                      Cancel Deletion
                    </button>
                  )}
                  <button
                    className="banner-btn primary"
                    onClick={handleRestore}
                  >
                    Restore
                  </button>
                  <button
                    className="banner-btn danger"
                    onClick={handleHardDelete}
                  >
                    Delete Now
                  </button>
                </>
              )}
            </div>
          </div>
        )}

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
              disabled={!!isArchived}
            />
          </div>

          <div className="editor-actions">
            {!isArchived && (
              <>
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
              </>
            )}

            {data?.getDocumentByID && !isArchived && (
              <>
                <button
                  className="share-btn share-btn-group"
                  onClick={() => setShowShareDialog(true)}
                >
                  <span className="material-icons">share</span>
                  Share
                </button>

                <ShareDialog
                  isOpen={showShareDialog}
                  onClose={() => setShowShareDialog(false)}
                  documentId={id!}
                  currentVisibility={data.getDocumentByID.visibility as any}
                  isOwner={isOwner}
                  onVisibilityChange={() => refetch()}
                />
              </>
            )}

            {isOwner && !isArchived && (
              <button
                className="archive-btn"
                onClick={() => setShowArchiveModal(true)}
                title="Archive Document"
              >
                <span className="material-icons">archive</span>
              </button>
            )}
          </div>
        </div>

        <div
          className={`editor-canvas ${isArchived ? "read-only-canvas" : ""}`}
        >
          <SlateEditor
            initialContent={content}
            onChange={handleChange}
            readOnly={!!isArchived}
          />
        </div>
      </div>

      <div className="editor-sidebar">
        <div className="sidebar-header-row">
          <div className="sidebar-header">Collaborators</div>
          <button
            className="invite-icon-btn"
            onClick={() => setShowShareDialog(true)}
            title="Invite People"
            disabled={!!isArchived}
          >
            <span className="material-icons">person_add</span>
          </button>
        </div>
        <div className="sidebar-content">
          <ul className="active-users-list">
            {collaboratorList.map((u) => (
              <li
                key={u.id || u.socketId}
                className={`active-user-item ${
                  u.isActive ? "status-active" : "status-offline"
                }`}
              >
                <div
                  className="user-avatar"
                  style={{ backgroundColor: u.color }}
                >
                  {u.personalInformation?.firstName?.[0] || u.email?.[0] || "?"}
                  {u.isActive && <span className="avatar-status-dot"></span>}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {u.personalInformation?.firstName || "User"}
                    {u.isOwner && <span className="owner-badge">Owner</span>}
                  </div>
                  <div className="user-email">{u.email}</div>
                  {u.isActive && <div className="active-text">Active</div>}
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
