import React, { useState } from "react";
import "../styles/ArchiveModal.css";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (removeCollaborators: boolean, scheduleDeletion: boolean) => void;
  title: string;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  const [removeCollaborators, setRemoveCollaborators] = useState(false);
  const [archiveOption, setArchiveOption] = useState<"SOFT" | "SCHEDULED">(
    "SOFT"
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(removeCollaborators, archiveOption === "SCHEDULED");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Archive Document</h3>
        <p>
          Are you sure you want to archive <strong>"{title}"</strong>?
        </p>

        <div className="modal-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={removeCollaborators}
              onChange={(e) => setRemoveCollaborators(e.target.checked)}
            />
            Do you want to remove all collaborators?
          </label>
        </div>

        <div className="modal-radio-group">
          <label className="radio-label">
            <input
              type="radio"
              value="SOFT"
              checked={archiveOption === "SOFT"}
              onChange={() => setArchiveOption("SOFT")}
            />
            <div>
              <strong>Archive Only</strong>
              <div className="radio-desc">
                Soft delete (item remains recoverable)
              </div>
            </div>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              value="SCHEDULED"
              checked={archiveOption === "SCHEDULED"}
              onChange={() => setArchiveOption("SCHEDULED")}
            />
            <div>
              <strong>Archive & Delete in 30 Days</strong>
              <div className="radio-desc">
                Schedule for permanent deletion after 30 days
              </div>
            </div>
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
