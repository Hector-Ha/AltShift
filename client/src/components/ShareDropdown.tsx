import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "../gql";
import type { DocumentStatus } from "../gql/graphql";
import "../styles/ShareDropdown.css";

const UPDATE_DOCUMENT_VISIBILITY = gql(`
  mutation UpdateDocumentVisibility($id: ID!, $input: updateDocumentInput!) {
    updateDocument(documentID: $id, input: $input) {
      id
      visibility
      isPublic
    }
  }
`);

interface ShareDropdownProps {
  documentId: string;
  currentVisibility: DocumentStatus;
  isOwner: boolean;
  onVisibilityChange?: (newVisibility: DocumentStatus) => void;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({
  documentId,
  currentVisibility,
  isOwner,
  onVisibilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [updateVisibility, { loading }] = useMutation(
    UPDATE_DOCUMENT_VISIBILITY
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVisibilitySelect = async (status: DocumentStatus) => {
    setIsOpen(false);
    if (status === currentVisibility) return;

    if (status === "SHARED") {
      alert("Shared functionality coming soon!");

      return;
    }

    if (status === "PRIVATE") {
      const confirmPrivate = window.confirm(
        "Make Private? This will remove all collaborators."
      );
      if (!confirmPrivate) return;
    }

    await changeVisibility(status);

    if (status === "PUBLIC") {
      setShowLinkModal(true);
    }
  };

  const changeVisibility = async (status: DocumentStatus) => {
    try {
      await updateVisibility({
        variables: {
          id: documentId,
          input: { visibility: status },
        },
      });
      if (onVisibilityChange) onVisibilityChange(status);
    } catch (err) {
      console.error("Failed to update visibility", err);
      alert("Failed to update visibility");
    }
  };

  const getButtonLabel = () => {
    switch (currentVisibility) {
      case "PUBLIC":
        return "Public";
      case "SHARED":
        return "Shared";
      case "PRIVATE":
        return "Private";
      default:
        return "Share";
    }
  };

  const getButtonIcon = () => {
    switch (currentVisibility) {
      case "PUBLIC":
        return "public";
      case "SHARED":
        return "group";
      case "PRIVATE":
        return "lock";
      default:
        return "share";
    }
  };

  const publicLink = `${window.location.origin}/doc/${documentId}`;

  return (
    <div className="share-dropdown-container" ref={dropdownRef}>
      <button
        className="share-btn"
        onClick={() => isOwner && setIsOpen(!isOpen)}
        disabled={!isOwner || loading}
      >
        <span className="material-icons share-btn-icon">{getButtonIcon()}</span>
        {getButtonLabel()}
        {isOwner && (
          <span className="material-icons share-btn-icon">arrow_drop_down</span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div
            className="dropdown-item"
            onClick={() => handleVisibilitySelect("PRIVATE")}
          >
            <span className="material-icons dropdown-item-icon">lock</span>
            Private
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleVisibilitySelect("SHARED")}
          >
            <span className="material-icons dropdown-item-icon">group</span>
            Shared
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleVisibilitySelect("PUBLIC")}
          >
            <span className="material-icons dropdown-item-icon">public</span>
            Public
          </div>
        </div>
      )}

      {showLinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Document is now Public</h3>
            <p>
              Anyone with this link can view and save this document to their
              list.
            </p>
            <div className="link-copy-container">
              <input readOnly value={publicLink} className="link-input" />
              <button
                onClick={() => navigator.clipboard.writeText(publicLink)}
                className="copy-btn"
              >
                Copy
              </button>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowLinkModal(false)}
                className="modal-done-btn"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;
