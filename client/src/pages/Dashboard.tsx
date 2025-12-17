import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
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
  query GetDocuments($filter: DocumentFilterInput) {
    getDocuments(filter: $filter) {
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

const GET_USER_HEADER = gql(`
  query GetUserHeader($id: ID!) {
    getUserByID(id: $id) {
      id
      personalInformation {
        firstName
        lastName
      }
      profilePicture
    }
  }
`);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [filter, setFilter] = useState("RECENTS");
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  const { data: userData } = useQuery<any>(GET_USER_HEADER, {
    variables: { id: userId || "" },
    skip: !userId,
  });

  const user = userData?.getUserByID;
  const initials = user?.personalInformation
    ? `${user.personalInformation.firstName[0]}${user.personalInformation.lastName[0]}`
    : "U";

  const { data, loading, error, refetch } = useQuery<
    GetDocumentsQuery,
    GetDocumentsQueryVariables
  >(GET_DOCUMENTS, {
    variables: {
      filter: {
        isArchived: viewMode === "ARCHIVED",
      },
    },
    fetchPolicy: "network-only",
  });

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
          <div className="profile-menu-container">
            <button
              className="profile-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="profile-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" />
                ) : (
                  initials
                )}
              </div>
              <span className="profile-name">
                {user?.personalInformation
                  ? `${user.personalInformation.firstName} ${user.personalInformation.lastName}`
                  : "User"}
              </span>
              <span className="material-icons profile-trigger-icon">
                expand_more
              </span>
            </button>

            {isMenuOpen && (
              <div className="profile-dropdown">
                <button
                  className="profile-dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  <span className="material-icons">person</span>
                  Profile
                </button>
                <div className="profile-dropdown-divider" />
                <button
                  className="profile-dropdown-item"
                  onClick={handleLogout}
                >
                  <span className="material-icons">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
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
            <div className="section-tabs">
              <button
                className={`tab-btn ${viewMode === "ACTIVE" ? "active" : ""}`}
                onClick={() => setViewMode("ACTIVE")}
              >
                Documents
              </button>
              <button
                className={`tab-btn ${viewMode === "ARCHIVED" ? "active" : ""}`}
                onClick={() => setViewMode("ARCHIVED")}
              >
                Archived
              </button>
            </div>
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
