import React, { useState, useContext } from "react";

import "./Auth.css";

import AuthContext from "../../context/auth-context";

const AuthPage = () => {
  const [mode, setMode] = useState("Login");
  const currentAuth = useContext(AuthContext);

  const emailEl = React.createRef();
  const passwordEl = React.createRef();

  /**
   * Submit the login/signup form to the GraphQL API.
   *
   * @param event
   */
  const handleSubmit = async event => {
    event.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;
    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (mode !== "Login") {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: { email: $email, password: $password }) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const { data } = await response.json();

      if (data.login && data.login.token) {
        const { userId, token, tokenExpiration } = data.login;
        currentAuth.login(userId, token, tokenExpiration);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() => setMode(mode === "Login" ? "Sign-up" : "Login")}
        >
          Switch to {mode === "Login" ? "Sign-up" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
