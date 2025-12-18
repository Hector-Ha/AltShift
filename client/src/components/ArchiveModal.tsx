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
        <div className="modal-header">
          <div className="modal-title">Archive Document</div>
          <p className="modal-description">
            Are you sure you want to archive <strong>"{title}"</strong>? This
            action can be reversed based on your selection below.
          </p>
        </div>

        <div className="modal-body">
          <div className="modal-radio-group">
            <label
              className={`radio-option ${
                archiveOption === "SOFT" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                value="SOFT"
                checked={archiveOption === "SOFT"}
                onChange={() => setArchiveOption("SOFT")}
              />
              <div className="radio-content">
                <span className="radio-title">Archive Only</span>
                <span className="radio-desc">
                  Soft delete (item remains recoverable anytime)
                </span>
              </div>
            </label>

            <label
              className={`radio-option ${
                archiveOption === "SCHEDULED" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                value="SCHEDULED"
                checked={archiveOption === "SCHEDULED"}
                onChange={() => setArchiveOption("SCHEDULED")}
              />
              <div className="radio-content">
                <span className="radio-title">Archive & Delete in 30 Days</span>
                <span className="radio-desc">
                  Schedule for permanent deletion after 30 days
                </span>
              </div>
            </label>
          </div>

          <label className="checkbox-option">
            {/* Custom Checkbox handled via CSS accent-color or we can build a custom one. default with accent-color is fine for now. */}
            <input
              type="checkbox"
              checked={removeCollaborators}
              onChange={(e) => setRemoveCollaborators(e.target.checked)}
            />
            <span className="checkbox-text">Remove all collaborators</span>
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirm Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
