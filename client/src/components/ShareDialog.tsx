import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "../gql";
import type { DocumentStatus } from "../gql/graphql";
import "../styles/ShareDropdown.css"; // Reuse for now, can refactor later

const UPDATE_VISIBILITY = gql(`
  mutation UpdateVisibility($id: ID!, $input: updateDocumentInput!) {
    updateDocument(documentID: $id, input: $input) {
      id
      visibility
      isPublic
    }
  }
`);

const INVITE_COLLABORATOR = gql(`
  mutation InviteCollaborator($documentID: ID!, $email: String!) {
    inviteCollaborator(documentID: $documentID, email: $email) {
      id
      visibility
      invitations {
        id
      }
    }
  }
`);

const REMOVE_COLLABORATOR = gql(`
  mutation RemoveCollaborator($documentID: ID!, $userID: ID!) {
     removeCollaborator(documentID: $documentID, userID: $userID) {
       id
       collaborators { id }
     }
  }
`);

// To display collaborators list
const GET_DOC_USERS = gql(`
  query GetDocUsers($id: ID!) {
    getDocumentByID(id: $id) {
      id
      owner { id email personalInformation { firstName } }
      collaborators { id email personalInformation { firstName } }
      invitations { id email personalInformation { firstName } }
    }
  }
`);

interface UserInfo {
  id: string;
  email: string;
  personalInformation?: {
    firstName?: string;
  };
}

interface DocData {
  getDocumentByID: {
    id: string;
    owner: UserInfo;
    collaborators: UserInfo[];
    invitations: UserInfo[];
  };
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentVisibility: DocumentStatus;
  isOwner: boolean;
  onVisibilityChange?: (status: DocumentStatus) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  documentId,
  currentVisibility,
  isOwner,
  onVisibilityChange,
}) => {
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"invite" | "manage">("invite");

  const {
    data,
    loading: dataLoading,
    refetch,
  } = useQuery<DocData>(GET_DOC_USERS as any, {
    variables: { id: documentId },
    skip: !isOpen,
    fetchPolicy: "network-only",
  });

  const [updateVisibility] = useMutation(UPDATE_VISIBILITY);
  const [inviteUser, { loading: inviteLoading }] =
    useMutation(INVITE_COLLABORATOR);
  const [removeUser] = useMutation(REMOVE_COLLABORATOR);

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await inviteUser({
        variables: { documentID: documentId, email },
      });
      alert(`Invitation sent to ${email}`);
      setEmail("");
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to invite");
    }
  };

  const handleVisibilityChange = async (status: DocumentStatus) => {
    try {
      await updateVisibility({
        variables: { id: documentId, input: { visibility: status } },
      });
      if (onVisibilityChange) onVisibilityChange(status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      await removeUser({
        variables: { documentID: documentId, userID: userId },
      });
      refetch();
    } catch (err) {
      alert("Failed to remove user");
    }
  };

  const publicLink = `${window.location.origin}/doc/${documentId}`;

  return (
    <div className="modal-overlay">
      <div className="modal-content share-dialog">
        <div className="share-header">
          <h3>Share Document</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="share-tabs">
          <button
            className={activeTab === "invite" ? "active" : ""}
            onClick={() => setActiveTab("invite")}
          >
            Invite
          </button>
          <button
            className={activeTab === "manage" ? "active" : ""}
            onClick={() => setActiveTab("manage")}
          >
            Manage Access
          </button>
        </div>

        {activeTab === "invite" && (
          <div className="tab-content">
            <form onSubmit={handleInvite}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="link-input"
                autoFocus
              />
              <button
                type="submit"
                className="modal-done-btn"
                disabled={inviteLoading}
              >
                {inviteLoading ? "Sending..." : "Send Invite"}
              </button>
            </form>

            <div className="link-section">
              <h4>General Access</h4>
              <select
                value={currentVisibility}
                onChange={(e) =>
                  handleVisibilityChange(e.target.value as DocumentStatus)
                }
                disabled={!isOwner}
              >
                <option value="PRIVATE">Restricted (Private)</option>
                <option value="SHARED">Restricted (Shared)</option>
                <option value="PUBLIC">Anyone with the link</option>
              </select>

              {currentVisibility === "PUBLIC" && (
                <div className="copy-link-box">
                  <input readOnly value={publicLink} />
                  <button
                    onClick={() => navigator.clipboard.writeText(publicLink)}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="tab-content user-list">
            {dataLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="user-item">
                  <span className="user-info">
                    <strong>
                      {data?.getDocumentByID?.owner?.personalInformation
                        ?.firstName || "Owner"}
                    </strong>{" "}
                    (Owner)
                    <br />
                    <small>{data?.getDocumentByID?.owner?.email}</small>
                  </span>
                </div>
                {data?.getDocumentByID?.collaborators?.map((u: any) => (
                  <div key={u.id} className="user-item">
                    <span className="user-info">
                      <strong>
                        {u.personalInformation?.firstName || "User"}
                      </strong>
                      <br />
                      <small>{u.email}</small>
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleRemove(u.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {data?.getDocumentByID?.invitations?.map((u: any) => (
                  <div key={u.id} className="user-item pending">
                    <span className="user-info">
                      <strong>
                        {u.personalInformation?.firstName || "User"}
                      </strong>{" "}
                      (Pending)
                      <br />
                      <small>{u.email}</small>
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleRemove(u.id)}
                        className="remove-btn"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <style>{`
        .share-dialog { min-width: 400px; }
        .share-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;}
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
        .share-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #eee; }
        .share-tabs button { background: none; border: none; padding: 10px; cursor: pointer; border-bottom: 2px solid transparent;}
        .share-tabs button.active { border-bottom-color: #007bff; font-weight: bold; }
        .user-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
        .remove-btn { background: none; border: none; color: red; cursor: pointer; font-size: 0.9em; }
        .link-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        .link-section select { width: 100%; padding: 8px; margin-top: 5px; }
        .copy-link-box { display: flex; margin-top: 10px; gap: 5px; }
        .copy-link-box input { flex: 1; padding: 5px; }
      `}</style>
    </div>
  );
};

export default ShareDialog;
