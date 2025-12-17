import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "../gql";
import "../styles/ShareDropdown.css"; // Reuse existing styles or create specific ones

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  onInviteSuccess?: () => void;
}

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

const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  isOpen,
  onClose,
  documentId,
  onInviteSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [inviteCollaborator, { loading }] = useMutation(INVITE_COLLABORATOR);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await inviteCollaborator({
        variables: {
          documentID: documentId,
          email: email,
        },
      });
      alert(`Invitation sent to ${email}`);
      setEmail("");
      if (onInviteSuccess) onInviteSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to send invitation");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Invite Collaborator</h3>
        <p>Enter the email address of the user you want to invite.</p>
        <form onSubmit={handleSubmit}>
          <div className="link-copy-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="link-input"
              placeholder="user@example.com"
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-cancel-btn"
              style={{
                marginRight: "10px",
                background: "#f0f0f0",
                color: "#333",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
            <button type="submit" className="modal-done-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteCollaboratorModal;
