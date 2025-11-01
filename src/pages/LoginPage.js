import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // gọi API backend
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      alert("✅ Login successful!");
      window.location.href = "/taskweek"; // hoặc điều hướng sang trang khác
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome back 👋</h2>
        <p className="subtitle">Log in to your Daily Performance Tracker</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="minh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-login">
            Log In
          </button>
        </form>

        <p className="register-text">
          Don’t have an account?{" "}
          <a href="/register" className="register-link">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
