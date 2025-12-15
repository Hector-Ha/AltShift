import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { socket } from "../socket/socket";
import SlateEditor from "../components/text-editor/SlateEditor";
import Logo from "../components/Logo";
import "../styles/editor.css";
import ShareDropdown from "../components/ShareDropdown";

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

  const handleChange = (newContent: string) => {
    setContent(newContent);

    if (!isLocalUpdate.current && socket) {
      socket.emit("text-update", {
        documentId: id!,
        operation: { content: newContent },
      });
    }
  };

  const handleSave = () => {
    saveDocument({
      variables: {
        id: id!,
        input: { content },
      },
    });
  };

  if (!id) return <div>Error: No Document ID provided</div>;
  if (loading) return <div>Loading Doc...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="editor-page">
      {/* Main Content Area */}
      <div className="editor-main">
        <div className="editor-header">
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
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          {data?.getDocumentByID && (
            <ShareDropdown
              documentId={id!}
              currentVisibility={data.getDocumentByID.visibility as any}
              isOwner={
                data.getDocumentByID.owner.id === localStorage.getItem("userId")
              }
            />
          )}
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
