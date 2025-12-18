import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ErrorPage.css";

interface ErrorPageProps {
  code?: string | number;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  code = "404",
  title = "Page Not Found",
  message = "Oops! We couldn't find the page you're looking for. It might have been removed or renamed.",
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="error-page-container">
      <div className="error-content">
        <h1 className="error-code">{code}</h1>
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>

        {showHomeButton && (
          <div className="error-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
