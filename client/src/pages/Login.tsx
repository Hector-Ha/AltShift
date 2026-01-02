import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { gql } from "../gql";
import { HelpCircle } from "lucide-react";
import Alert from "../components/Alert";
import LogoWhite from "../assets/logos/logo-white.svg";
import LoginBg from "../assets/images/AltShift Login.jpg";
import type { LoginMutation, LoginMutationVariables } from "../gql/graphql";

const LOGIN_MUTATION = gql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`);

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  React.useEffect(() => {
    if (location.state?.message) {
      setAuthError(location.state.message);
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [login, { loading, error }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login) {
        localStorage.setItem("token", data.login.token);
        if (data.login.user) {
          localStorage.setItem("userId", data.login.user.id);
        }
        navigate("/dashboard");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <div className="login-page">
      {/* Brand */}
      <div
        className="login-brand-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("${LoginBg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="brand-header" style={{ gap: "6px" }}>
          <img src={LogoWhite} alt="AltShift Logo" width={32} height={32} />
          <span style={{ fontSize: "18px" }}>AltShift</span>
        </div>
        <div className="brand-content">
          <div className="attribution-card">
            <p className="quote">
              "Experience the future of document collaboration."
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="form-header">
            <h1>Welcome back</h1>
            <p>Enter your email below to login to your account</p>
          </div>

          {authError && (
            <Alert type="error" title="Authentication Error">
              {authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                className="input-field"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password-container">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {error && (
            <Alert type="error" title="Login Failed">
              {error.message === "No User Found" ||
              error.message.includes("Invalid Password")
                ? "Invalid email or password"
                : error.message}
            </Alert>
          )}

          <div className="auth-footer">
            Don't have an account?
            <Link to="/signup" className="switch-auth-btn-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      {/* Hint Button */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          className="btn"
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            color: "#111827",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
          onClick={(e) => {
            e.preventDefault();
            const hints = document.getElementById("login-hints");
            if (hints) {
              hints.style.display =
                hints.style.display === "none" ? "block" : "none";
            }
          }}
        >
          <HelpCircle size={16} />
          <span>Demo Credentials</span>
        </button>
        <div
          id="login-hints"
          style={{
            display: "none",
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "10px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            width: "280px",
            color: "#333",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#111",
            }}
          >
            Demo Credentials
          </h4>
          <div style={{ marginBottom: "12px", fontSize: "13px" }}>
            <div
              style={{ marginBottom: "4px", fontWeight: "500", color: "#666" }}
            >
              User A
            </div>
            <div
              style={{
                background: "#f3f4f6",
                padding: "8px",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
            >
              <div>Email: demo@example.com</div>
              <div>Pass: password123</div>
            </div>
          </div>
          <div style={{ fontSize: "13px" }}>
            <div
              style={{ marginBottom: "4px", fontWeight: "500", color: "#666" }}
            >
              User B
            </div>
            <div
              style={{
                background: "#f3f4f6",
                padding: "8px",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
            >
              <div>Email: test@example.com</div>
              <div>Pass: password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
