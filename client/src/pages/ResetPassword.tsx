import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { gql } from "../gql";
import Alert from "../components/Alert";
import LogoWhite from "../assets/logos/logo-white.svg";
import type {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from "../gql/graphql";

const RESET_PASSWORD_MUTATION = gql(`
  mutation ResetPassword($input: resetPasswordInput!) {
    resetPassword(input: $input)
  }
`);

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { loading, error }] = useMutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >(RESET_PASSWORD_MUTATION, {
    onCompleted: (data) => {
      if (data.resetPassword) {
        navigate("/");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    resetPassword({
      variables: {
        input: {
          token,
          newPassword,
        },
      },
    });
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-form-section login-form-full-width">
          <div className="login-form-container">
            <p>Invalid or missing token.</p>
            <Link to="/">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h1>Reset Password</h1>
            <p>Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                className="input-field"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                className="input-field"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {error && (
            <Alert type="error" title="Error">
              {error.message}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
