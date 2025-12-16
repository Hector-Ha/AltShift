import React, { useState } from "react";
import "../styles/NewLogin.css";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { gql } from "../gql";
import Logo from "../components/Logo";
import type {
  LoginMutation,
  LoginMutationVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
} from "../gql/graphql";

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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState("");

  const [login, { loading: loginLoading, error: loginError }] = useMutation<
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

  const [register, { loading: regLoading, error: regError }] = useMutation<
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
    if (isRegister) {
      register({
        variables: {
          input: {
            email,
            password,
            personalInformation: { firstName },
          },
        },
      });
    } else {
      login({ variables: { email, password } });
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    // Clear errors or reset form state if needed
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
            {/* Mobile Logo - Visible only in single column if we wanted, but CSS hides brand section. 
                We can add a top logo for mobile here if needed. */}
            <h1>{isRegister ? "Create an account" : "Welcome back"}</h1>
            <p>
              {isRegister
                ? "Enter your details below to create your account"
                : "Enter your email below to login to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
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
            )}

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

            <button
              type="submit"
              className="submit-btn"
              disabled={loginLoading || regLoading}
            >
              {isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {(loginError || regError) && (
            <div className="error-message">
              {loginError && <p>Login Error: {loginError.message}</p>}
              {regError && <p>Register Error: {regError.message}</p>}
            </div>
          )}

          <div className="auth-footer">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button className="switch-auth-btn" onClick={toggleMode}>
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
