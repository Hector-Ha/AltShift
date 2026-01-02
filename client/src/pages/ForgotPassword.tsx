import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { gql } from "../gql";
import Alert from "../components/Alert";
import LogoWhite from "../assets/logos/logo-white.svg";
import type {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
} from "../gql/graphql";

const FORGOT_PASSWORD_MUTATION = gql(`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`);

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const [forgotPassword, { loading, error }] = useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(FORGOT_PASSWORD_MUTATION, {
    onCompleted: () => {
      setSuccess(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword({ variables: { email } });
  };

  return (
    <div className="login-page">
      <div className="login-brand-section">
        <div className="brand-header" style={{ gap: "6px" }}>
          <img src={LogoWhite} alt="AltShift Logo" width={32} height={32} />
          <span style={{ fontSize: "18px" }}>AltShift</span>
        </div>
      </div>
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="form-header">
            <h1>Forgot Password</h1>
            <p>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {!success ? (
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

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <Alert type="success" title="Email Sent">
              If an account exists for {email}, we have sent a password reset
              link.
            </Alert>
          )}

          {error && (
            <Alert type="error" title="Error">
              {error.message}
            </Alert>
          )}

          <div className="auth-footer">
            Remember your password?
            <Link to="/" className="switch-auth-btn-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
