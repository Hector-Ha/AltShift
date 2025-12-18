import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { gql } from "../gql";
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
            <div
              className="error-message"
              style={{
                marginBottom: "20px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid var(--error)",
                color: "var(--error)",
              }}
            >
              <p>{authError}</p>
            </div>
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
            <div className="error-message">
              <p>Login Error: {error.message}</p>
            </div>
          )}

          <div className="auth-footer">
            Don't have an account?
            <Link to="/signup" className="switch-auth-btn-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
