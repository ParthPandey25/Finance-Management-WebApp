import React, { useState } from "react";
import Axios from "axios";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "parth@finance.local",
    password: "Password123!",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isRegister) {
        const res = await Axios.post(`${API_URL}/api/auth/register`, {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("auth_user", JSON.stringify(res.data));

        setStatusMessage("Account registered & authenticated!");
        if (onLoginSuccess) onLoginSuccess(res.data);

        setTimeout(() => {
          setStatusMessage("");
          onClose();
        }, 800);
      } else {
        const res = await Axios.post(`${API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("auth_user", JSON.stringify(res.data));

        setStatusMessage("Authenticated successfully!");
        if (onLoginSuccess) onLoginSuccess(res.data);

        setTimeout(() => {
          setStatusMessage("");
          onClose();
        }, 800);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Authentication failed. Please check credentials.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="auth-header">
          <div className="auth-badge">Secure Portal</div>
          <h2 className="auth-title">
            {isRegister ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? "Register to manage and protect your personal financial records"
              : "Sign in with your credentials to access your secure financial dashboard"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setStatusMessage("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setStatusMessage("");
            }}
          >
            Register
          </button>
        </div>

        {statusMessage && (
          <div className="auth-alert-success">{statusMessage}</div>
        )}

        {errorMessage && (
          <div
            className="auth-alert-error"
            style={{
              background: "rgba(255, 80, 80, 0.15)",
              border: "1px solid #ff5555",
              color: "#ff6666",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Parth Pandey"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="user@finance.local"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isRegister && (
            <div className="auth-demo-hint">
              <span>Demo Account:</span>
              <code>parth@finance.local / Password123!</code>
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {isRegister ? "Create Secure Account" : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            {isRegister
              ? "Already have an account? "
              : "Don't have an account yet? "}
          </span>
          <button
            type="button"
            className="auth-toggle-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setStatusMessage("");
            }}
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
