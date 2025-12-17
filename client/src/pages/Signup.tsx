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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const validatePassword = (pwd: string) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*]/.test(pwd);
    const isValidLength = pwd.length >= 8;

    if (!isValidLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter (A-Z).";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter (a-z).";
    if (!hasNumber) return "Password must contain at least one number (0-9).";
    if (!hasSpecialChar)
      return "Password must contain at least one special character (!@#$%^&*).";

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    register({
      variables: {
        input: {
          email,
          password,
          personalInformation: {
            firstName,
            lastName,
            jobTitle,
            organization,
          },
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
            <div className="form-row">
              <div className="form-group half-width">
                <input
                  className="form-input"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group half-width">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <input
                className="form-input"
                type="text"
                placeholder="Job Title (Optional)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                className="form-input"
                type="text"
                placeholder="Organization / Company"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
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

            <div className="form-group">
              <input
                className="form-input"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {validationError && (
            <div className="error-message">
              <p>{validationError}</p>
            </div>
          )}

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
