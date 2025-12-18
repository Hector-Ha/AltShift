import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logos/logo.svg";
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
import Dropdown from "../components/Dropdown";
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
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST" | "AZ" | "ZA">(
    "NEWEST"
  );
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
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

  React.useEffect(() => {
    if (error) {
      navigate("/", {
        state: {
          message: "You are not authenticated, please try log in again",
        },
      });
    }
  }, [error, navigate]);

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
      switch (sortOrder) {
        case "NEWEST":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "OLDEST":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        case "AZ":
          return a.title.localeCompare(b.title);
        case "ZA":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const handleSortChange = (order: "NEWEST" | "OLDEST" | "AZ" | "ZA") => {
    setSortOrder(order);
    if (filter === "RECENTS") {
      setFilter("ALL");
    }
    setIsSortMenuOpen(false);
  };

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
        <Link to="/dashboard" className="nav-brand" style={{ gap: "6px" }}>
          <img src={Logo} alt="AltShift Logo" width={32} height={32} />
          <span style={{ fontSize: "18px" }}>AltShift</span>
        </Link>
        <div className="nav-actions">
          <div className="profile-menu-container">
            <Dropdown
              isOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              align="right"
              trigger={
                <button className="profile-trigger">
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
              }
            >
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
              >
                <span className="material-icons">person</span>
                Profile
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <span className="material-icons">logout</span>
                Logout
              </button>
            </Dropdown>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Left Sidebar - Document List & Filters */}
        <aside className="dashboard-sidebar">
          {/* Filter & Sort Row */}
          <div className="filter-row">
            <Dropdown
              className="filter-select"
              isOpen={isFilterMenuOpen}
              onOpenChange={setIsFilterMenuOpen}
              trigger={
                <div className="filter-select-trigger">
                  {filter === "RECENTS" && "Recents"}
                  {filter === "ALL" && "All"}
                  {filter === "OWNED" && "Owned"}
                  {filter === "NOT_OWNED" && "Not Owned"}
                </div>
              }
            >
              <button
                className={`dropdown-item ${
                  filter === "RECENTS" ? "active" : ""
                }`}
                onClick={() => {
                  setFilter("RECENTS");
                  setIsFilterMenuOpen(false);
                }}
              >
                Recents
              </button>
              <button
                className={`dropdown-item ${filter === "ALL" ? "active" : ""}`}
                onClick={() => {
                  setFilter("ALL");
                  setIsFilterMenuOpen(false);
                }}
              >
                All
              </button>
              <button
                className={`dropdown-item ${
                  filter === "OWNED" ? "active" : ""
                }`}
                onClick={() => {
                  setFilter("OWNED");
                  setIsFilterMenuOpen(false);
                }}
              >
                Owned
              </button>
              <button
                className={`dropdown-item ${
                  filter === "NOT_OWNED" ? "active" : ""
                }`}
                onClick={() => {
                  setFilter("NOT_OWNED");
                  setIsFilterMenuOpen(false);
                }}
              >
                Not Owned
              </button>
            </Dropdown>

            <div className="sort-dropdown-container">
              <Dropdown
                isOpen={isSortMenuOpen}
                onOpenChange={setIsSortMenuOpen}
                align="right"
                trigger={
                  <button
                    className="filter-btn filter-btn-nowrap"
                    title="Sort Documents"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "16px" }}
                    >
                      sort
                    </span>
                    Sort
                  </button>
                }
              >
                <button
                  className={`dropdown-item ${
                    sortOrder === "NEWEST" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("NEWEST")}
                >
                  Newest First
                </button>
                <button
                  className={`dropdown-item ${
                    sortOrder === "OLDEST" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("OLDEST")}
                >
                  Oldest First
                </button>
                <button
                  className={`dropdown-item ${
                    sortOrder === "AZ" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("AZ")}
                >
                  A-Z
                </button>
                <button
                  className={`dropdown-item ${
                    sortOrder === "ZA" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("ZA")}
                >
                  Z-A
                </button>
              </Dropdown>
            </div>
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
