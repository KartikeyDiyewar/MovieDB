import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SimpleSearch from "../simpleSearch/SimpleSearch";
import {
  clearSearch,
  openSurpriseModal,
  openAiModal,
} from "../../features/baseUrl/basicDataSlice";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalData, isSearch, searchTerm } = useSelector(
    (store) => store.base
  );

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("kd_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kd_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogoClick = () => {
    dispatch(clearSearch());
    navigate("/");
  };

  const handleSurpriseClick = () => {
    dispatch(openSurpriseModal());
  };

  const handleAiClick = () => {
    dispatch(openAiModal());
  };

  return (
    <header className="navbar-header">
      <div className="navbar-accent-line" />
      <nav className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={handleLogoClick} title="Home">
          <div className="brand-logo-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="3"
                width="20"
                height="18"
                rx="4"
                stroke="url(#brandGrad)"
                strokeWidth="2"
              />
              <path
                d="M7 3V21M17 3V21M2 8H7M2 16H7M17 8H22M17 16H22M7 12H17"
                stroke="url(#brandGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="brandGrad"
                  x1="2"
                  y1="3"
                  x2="22"
                  y2="21"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">
              KD<span className="brand-highlight">MOVIEZ</span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <SimpleSearch />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Claude / OpenAI style Cinema AI Button */}
          <button
            className="navbar-ai-btn"
            onClick={handleAiClick}
            title="Open Cinema AI conversational assistant"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ai-icon-svg"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            <span className="ai-label">Cinema AI</span>
          </button>

          {/* Surprise Me Button */}
          <button
            className="navbar-surprise-btn"
            onClick={handleSurpriseClick}
            title="Random top-rated movie pick"
          >
            <span className="dice-icon">🎲</span>
            <span className="surprise-label">Surprise</span>
          </button>

          {/* Theme Toggle (Dark ⇄ Light) */}
          <button
            className="navbar-theme-btn"
            onClick={toggleTheme}
            title={
              theme === "dark"
                ? "Switch to Light mode"
                : "Switch to Dark mode"
            }
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {isSearch && totalData.total_results !== undefined && (
            <div className="navbar-badge">
              <span>
                &ldquo;{searchTerm}&rdquo; ({totalData.total_results})
              </span>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
