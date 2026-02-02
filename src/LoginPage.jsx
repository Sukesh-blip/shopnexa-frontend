import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import "./assets/styles.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await api.post("/api/auth/login", {
        username,
        password
      });

      const data = response.data;

      // Store JWT token and user info
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("username", data.username || username);
      localStorage.setItem("userRole", data.role);
      if (data.name) localStorage.setItem("displayName", data.name);

      if (data.role === "CUSTOMER") {
        navigate("/customerhome");
      } else if (data.role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
    }
  };

  return (
    <div className="page-layout">
      <div className="page-container">
        <div className="form-container">
          <h1 className="form-title">Login</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignIn} className="form-content">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="form-button">
              Sign In
            </button>
          </form>
          <div className="form-footer" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/register" className="form-link">
              New User? Sign up here
            </a>
            <a href="/" className="form-link" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              ← Back to Project Overview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
