import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import dashboard from "../assets/profile.png"; // ảnh bạn đã upload

const LandingPage = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="/logo192.png" alt="DailyTracker logo" />
          <span>DailyTracker</span>
        </div>
        <ul className="nav-links">
          <li>Features</li>
          <li>Integrations</li>
          <li>Pricing</li>
          <li>About</li>
        </ul>
        <div className="nav-buttons">
          <button className="btn-login" onClick={handleLogin}>Login</button>
          <button className="btn-login" onClick={handleRegister}>Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-text">
          <p className="badge">Best Productivity App 2025</p>
          <h1>
            Start Smart. <br />
            Stay Consistent. <br />
            Grow Confident.
          </h1>
          <p className="subtext">
            The all-in-one tracker and planner for modern learners and
            professionals. Build habits, stay organized, and make progress every
            day.
          </p>

          <div className="cta">
            <button className="btn-login large">Try for free</button>
            <span className="trial-text">No credit card required</span>
          </div>
        </div>

        <div className="hero-image">
          <img src={dashboard} alt="App dashboard" />
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
