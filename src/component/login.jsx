// Login.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/login.css';

import API from '../api.js';
import { setToken } from '../auth/auth.js';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const autoLoginData = location.state;

  const [email, setEmail] = useState(autoLoginData?.email || "");
  const [password, setPassword] = useState(autoLoginData?.password || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoLoginData?.email && autoLoginData?.password) {
      handleSubmit(); // Trigger auto-login
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoginData]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="forgot-password">
        <a href="/forgot-password">Forgot password?</a>
      </div>
    </div>
  );
};

export default Login;
