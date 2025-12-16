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
import RichTextPrompt from "../components/RichTextPrompt";
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
  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {
    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {
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
  const userId = localStorage.getItem("userId");

  const [createDocument] = useMutation<
    CreateDocumentMutation,
    CreateDocumentMutationVariables
  >(CREATE_DOCUMENT, {
    onCompleted: (data) => {
      console.log("Mutation completed:", data);
      refetch();
      if (data.createDocument?.id) {
        navigate(`/doc/${data.createDocument.id}`);
      }
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
              className="form-select filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="RECENTS">Recents</option>
              <option value="ALL">All</option>
              <option value="OWNED">Owned</option>
              <option value="NOT_OWNED">Not Owned</option>
            </select>
            <button
              className="filter-btn filter-btn-nowrap"
              onClick={() => alert("Sort/Filter functionality coming soon!")}
              title="More Filters & Sort"
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
                    <div className="doc-refresh-time">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                  </Link>
                )
              )}
              {filteredDocuments?.length === 0 && (
                <div className="no-docs-message">No documents found.</div>
              )}
            </div>
          </section>
        </aside>
        {/* Right Content - Home View */}
        <main className="dashboard-content dashboard-content-block">
          <div className="home-header-row">
            <h2 className="home-title">Home</h2>
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

          <RichTextPrompt
            onSubmit={(text, attachments) =>
              createDocumentWithAI({
                variables: { prompt: text, attachments: attachments as any },
              })
            }
            loading={aiLoading}
            placeholder="Type here to generate a document with AI (e.g., 'Project proposal for new app'). Press Enter to send."
          />

          <NotificationList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
