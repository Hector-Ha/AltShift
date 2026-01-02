import React from "react";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";

type AlertType =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "destructive";

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type = "default", title, children }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "destructive":
        return <AlertOctagon size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
        return <Info size={20} />;
      case "default":
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          border: "var(--success)",
          text: "var(--success)",
        };
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "var(--error)",
          text: "var(--error)",
        };
      case "destructive":
        return {
          bg: "rgba(185, 28, 28, 0.1)",
          border: "var(--destructive)",
          text: "var(--destructive)",
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          border: "var(--warning)",
          text: "var(--warning)",
        };
      case "info":
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          border: "var(--info)",
          text: "var(--info)",
        };
      case "default":
      default:
        return {
          bg: "var(--bg-surface-secondary)",
          border: "var(--border-color)",
          text: "var(--text-primary)",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        display: "flex",
        gap: "var(--space-3)",
        alignItems: "flex-start",
        color: type === "default" ? "var(--text-secondary)" : "#1e293b",
        marginBottom: "var(--space-4)",
      }}
    >
      <div style={{ color: styles.text, marginTop: "2px" }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        {title && (
          <h5
            style={{
              margin: "0 0 4px 0",
              color: styles.text,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {title}
          </h5>
        )}
        <div style={{ fontSize: "14px", lineHeight: "1.5" }}>{children}</div>
      </div>
    </div>
  );
};

export default Alert;
