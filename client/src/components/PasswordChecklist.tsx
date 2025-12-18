import React from "react";
import { checkPasswordRequirements } from "../utils/passwordValidation";
import { Check, Circle } from "lucide-react";

interface PasswordChecklistProps {
  password: string;
}

const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const reqs = checkPasswordRequirements(password);

  const CheckItem = ({ met, text }: { met: boolean; text: string }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontSize: "var(--font-size-xs)",
        color: met ? "var(--success)" : "var(--text-tertiary)",
        transition: "all 0.2s ease",
      }}
    >
      {met ? (
        <Check size={14} color={met ? "var(--success)" : "currentColor"} />
      ) : (
        <Circle size={14} color="var(--border-color)" />
      )}
      <span style={{ fontWeight: 500 }}>{text}</span>
    </div>
  );

  return (
    <div
      style={{
        marginTop: "var(--space-2)",
        padding: "var(--space-3)",
        backgroundColor: "var(--bg-surface-secondary)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <p
        style={{
          fontSize: "var(--font-size-xs)",
          color: "var(--text-secondary)",
          fontWeight: 600,
          marginBottom: "2px",
        }}
      >
        Password requirements:
      </p>
      <CheckItem met={reqs.length} text="At least 8 characters" />
      <CheckItem met={reqs.upperCase} text="Uppercase letter (A-Z)" />
      <CheckItem met={reqs.lowerCase} text="Lowercase letter (a-z)" />
      <CheckItem met={reqs.number} text="Number (0-9)" />
      <CheckItem met={reqs.specialChar} text="Special character (!@#$%^&*)" />
    </div>
  );
};

export default PasswordChecklist;
