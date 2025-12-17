import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { gql } from "../gql";
import Logo from "../components/Logo";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      {/* Left Side - Brand */}
      <div className="login-brand-section">
        <div className="brand-header">
          <Logo />
          <span>AltShift</span>
        </div>
        <div className="brand-content">
          <blockquote className="brand-quote">
            "This document editor has completely transformed how our team
            collaborates. It's fast, intuitive, and beautiful."
          </blockquote>
          <div className="brand-author">Sofia Davis, Product Designer</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="form-header">
            <h1>Welcome back</h1>
            <p>Enter your email below to login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                className="form-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                className="form-input"
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

            <button type="submit" className="submit-btn" disabled={loading}>
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
