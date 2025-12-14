import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { socket } from "../socket/socket";

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
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const isLocalUpdate = useRef(false);

  const { data, loading, error } = useQuery<
    GetDocumentQuery,
    GetDocumentQueryVariables
  >(GET_DOCUMENT, {
    variables: { id: id! },
  });

  useEffect(() => {
    if (data?.getDocumentByID?.content) {
      setContent(data.getDocumentByID.content ?? "");
    }
  }, [data]);

  const [saveDocument] = useMutation<
    UpdateDocumentMutation,
    UpdateDocumentMutationVariables
  >(UPDATE_DOCUMENT);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
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
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Editor Area */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{data?.getDocumentByID?.title}</h2>
          <button onClick={handleSave}>Save to DB</button>
        </div>
        <textarea
          style={{ flex: 1, width: "100%", padding: "10px", fontSize: "16px" }}
          value={content}
          onChange={handleChange}
        />
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          borderLeft: "1px solid #ccc",
          padding: "10px",
          background: "#f9f9f9",
        }}
      >
        <h3>Active Users</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {activeUsers.map((u) => (
            <li
              key={u.socketId}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: u.color,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                {u.firstName?.[0] || u.email?.[0] || "?"}
              </div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                  {u.firstName || "User"}
                </div>
                <div style={{ fontSize: "10px", color: "gray" }}>{u.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentEditor;
