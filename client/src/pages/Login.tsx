import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { gql } from "../gql";
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        {isRegister && (
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loginLoading || regLoading}>
          {isRegister ? "Sign Up" : "Sign In"}
        </button>
      </form>
      {loginError && (
        <p style={{ color: "red" }}>Login Error: {loginError.message}</p>
      )}
      {regError && (
        <p style={{ color: "red" }}>Register Error: {regError.message}</p>
      )}

      <button
        style={{
          marginTop: "20px",
          background: "none",
          border: "none",
          color: "blue",
          cursor: "pointer",
        }}
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </div>
  );
};

export default Login;
