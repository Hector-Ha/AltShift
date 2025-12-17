import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { gql } from "../gql";
import Logo from "../components/Logo";
import type {
  CreateUserMutation,
  CreateUserMutationVariables,
} from "../gql/graphql";

const REGISTER_MUTATION = gql(`
  mutation CreateUser($input: createUserInput!) {
    createUser(input: $input) {
      token
      user {
        id
      }
    }
  }
`);

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  const [register, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(REGISTER_MUTATION, {
    onCompleted: (data) => {
      if (data.createUser) {
        localStorage.setItem("token", data.createUser.token);
        if (data.createUser.user) {
          localStorage.setItem("userId", data.createUser.user.id);
        }
        navigate("/dashboard");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      variables: {
        input: {
          email,
          password,
          personalInformation: { firstName },
        },
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-brand-section">
        <div className="brand-header">
          <Logo />
          <span>AltShift</span>
        </div>
        <div className="brand-content">
          <blockquote className="brand-quote">
            "Join usage today and experience the future of document
            collaboration."
          </blockquote>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-form-container">
          <div className="form-header">
            <h1>Create an account</h1>
            <p>Enter your details below to create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                className="form-input"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <p>Register Error: {error.message}</p>
            </div>
          )}

          <div className="auth-footer">
            Already have an account?
            <Link to="/" className="switch-auth-btn-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
