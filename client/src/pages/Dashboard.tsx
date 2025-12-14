import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { gql } from "../gql";
import Logo from "../components/Logo";
import type {
  GetDocumentsQuery,
  GetDocumentsQueryVariables,
  CreateDocumentMutation,
  CreateDocumentMutationVariables,
  DocumentStatus,
  CreateDocumentWithAiMutation,
  CreateDocumentWithAiMutationVariables,
} from "../gql/graphql";
import NotificationList from "../components/NotificationList";
import "../styles/dashboard.css";

const GET_DOCUMENTS = gql(`
  query GetDocuments {
    getDocuments(filter: {}) {
      id
      title
      updatedAt
      visibility
      owner {
        id
        email
      }
    }
  }
`);

const CREATE_DOCUMENT = gql(`
  mutation CreateDocument($input: createDocumentInput!) {
    createDocument(input: $input) {
      id
      title
    }
  }
`);

const CREATE_DOCUMENT_WITH_AI = gql(`
  mutation CreateDocumentWithAI($prompt: String!) {
    createDocumentWithAI(prompt: $prompt) {
      id
      title
    }
  }
`);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery<
    GetDocumentsQuery,
    GetDocumentsQueryVariables
  >(GET_DOCUMENTS, {
    fetchPolicy: "network-only",
  });

  const [filter, setFilter] = useState("RECENTS");
  const [search, setSearch] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const userId = localStorage.getItem("userId");

  const [createDocument] = useMutation<
    CreateDocumentMutation,
    CreateDocumentMutationVariables
  >(CREATE_DOCUMENT, {
    onCompleted: (data) => {
      console.log("Mutation completed:", data);
      refetch();
    },
    onError: (err) => {
      console.error("Mutation error:", err);
      alert(`Error creating document: ${err.message}`);
    },
  });

  const [createDocumentWithAI, { loading: aiLoading }] = useMutation<
    CreateDocumentWithAiMutation,
    CreateDocumentWithAiMutationVariables
  >(CREATE_DOCUMENT_WITH_AI, {
    onCompleted: (data) => {
      console.log("AI Mutation completed:", data);
      refetch();
      setAiPrompt("");
      if (data.createDocumentWithAI?.id) {
        navigate(`/doc/${data.createDocumentWithAI.id}`);
      }
    },
    onError: (err) => {
      console.error("AI Mutation error:", err);
      alert(`Error creating document with AI: ${err.message}`);
    },
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredDocuments = data?.getDocuments
    .filter((doc: GetDocumentsQuery["getDocuments"][0]) => {
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === "OWNED") return doc.owner?.id === userId;
      if (filter === "NOT_OWNED") return doc.owner?.id !== userId;
      return true;
    })
    .sort((a: any, b: any) => {
      if (filter === "RECENTS" || true) {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });

  if (loading)
    return (
      <div className="dashboard-layout">
        <div className="dashboard-content">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="dashboard-layout">
        <div className="dashboard-content">Error: {error.message}</div>
      </div>
    );

  return (
    <div className="dashboard-layout">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <Logo />
          <span>AltShift</span>
        </div>
        <div className="nav-actions">
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Left Sidebar - Document List & Filters */}
        <aside className="dashboard-sidebar">
          {/* Filter & Sort Row */}
          <div className="filter-row">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="RECENTS">Recents</option>
              <option value="ALL">All</option>
              <option value="OWNED">Owned</option>
              <option value="NOT_OWNED">Not Owned</option>
            </select>
            <button
              className="filter-btn"
              onClick={() => alert("Sort/Filter functionality coming soon!")}
              title="More Filters & Sort"
              style={{ whiteSpace: "nowrap" }}
            >
              Filter/Sort
            </button>
          </div>

          {/* Search Row */}
          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <section>
            <h3 className="section-title">Documents</h3>
            <div className="documents-list">
              {filteredDocuments?.map(
                (doc: GetDocumentsQuery["getDocuments"][0]) => (
                  <Link key={doc.id} to={`/doc/${doc.id}`} className="doc-item">
                    <div>{doc.title}</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                  </Link>
                )
              )}
              {filteredDocuments?.length === 0 && (
                <div
                  style={{
                    padding: "1rem",
                    color: "#64748b",
                    fontSize: "0.875rem",
                  }}
                >
                  No documents found.
                </div>
              )}
            </div>
          </section>
        </aside>
        {/* Right Content - Home View */}
        <main className="dashboard-content" style={{ display: "block" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
              Home
            </h2>
            <button
              className="btn btn-primary"
              onClick={() =>
                createDocument({
                  variables: {
                    input: {
                      title: "Untitled Document",
                      visibility: "PRIVATE" as DocumentStatus,
                    },
                  },
                })
              }
            >
              Create New Document
            </button>
          </div>

          <textarea
            className="editor-placeholder"
            placeholder={
              aiLoading
                ? "Generating document..."
                : "Type here to generate a document with AI (e.g., 'Project proposal for new app'). Press Enter."
            }
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!aiPrompt.trim()) return;
                createDocumentWithAI({ variables: { prompt: aiPrompt } });
              }
            }}
            disabled={aiLoading}
          />

          <NotificationList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
