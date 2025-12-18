import React, { useState } from "react";
import "../styles/NewLogin.css";
import { validatePassword } from "../utils/passwordValidation";
import PasswordChecklist from "../components/PasswordChecklist";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { gql } from "../gql";
import LogoWhite from "../assets/logos/logo-white.svg";
import LoginBg from "../assets/images/AltShift Login.jpg";
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

      <div className="login-form-section">
        <div className="login-form-container">
          <div className="form-header">
            <h1>Create an account</h1>
            <p>Enter your details below to create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row" style={{ marginBottom: 0 }}>
              <div className="form-group half-width">
                <input
                  className="input-field"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group half-width">
                <input
                  className="input-field"
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
                className="input-field"
                type="text"
                placeholder="Job Title (Optional)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                className="input-field"
                type="text"
                placeholder="Organization / Company"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
              />
            </div>

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
              {password && <PasswordChecklist password={password} />}
            </div>

            <div className="form-group">
              <input
                className="input-field"
                type="password"
                placeholder="Confirm Password"
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
