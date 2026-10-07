import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SimpleSearch from "../simpleSearch/SimpleSearch";
import {
  clearSearch,
  openSurpriseModal,
  openAiModal,
  openWatchlist,
  setToast,
} from "../../features/baseUrl/basicDataSlice";
import { logoutUser } from "../../features/auth/authSlice";
import AiSparkIcon from "../common/AiSparkIcon";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalData, isSearch, searchTerm, watchlist } = useSelector(
    (store) => store.base
  );
  const { user, isAuthenticated } = useSelector((store) => store.auth || {});
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Ensure clean dark theme always
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("kd_theme");
  }, []);

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

  const handleLogout = () => {
    setShowUserMenu(false);
    dispatch(logoutUser());
    dispatch(setToast("Signed out successfully. See you soon! 👋"));
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
          {/* Cinema AI Button */}
          <button
            className="navbar-ai-btn"
            onClick={handleAiClick}
            title="Open Cinema AI conversational assistant"
          >
            <AiSparkIcon size={16} />
            <span className="ai-label">Cinema AI</span>
          </button>

          {/* Watchlist Button */}
          <button
            className="navbar-watchlist-btn"
            onClick={() => dispatch(openWatchlist())}
            title="Saved Watchlist & AI Taste Analysis"
            aria-label="Open Watchlist"
          >
            <span className="watchlist-nav-icon">🔖</span>
            <span className="watchlist-nav-label">Watchlist</span>
            {watchlist && watchlist.length > 0 && (
              <span className="navbar-watchlist-count">{watchlist.length}</span>
            )}
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

          {/* User Profile or Sign In Button */}
          {isAuthenticated && user ? (
            <div className="navbar-user-box">
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={`Signed in as ${user.name}`}
              >
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`
                  }
                  alt={user.name}
                  className="navbar-user-avatar"
                />
                <span className="navbar-user-name">
                  {user.name.split(" ")[0]}
                </span>
                <span className="user-caret">▾</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <p className="user-dropdown-name">{user.name}</p>
                    <p className="user-dropdown-role">
                      {user.email || user.phone || user.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      dispatch(openWatchlist());
                    }}
                  >
                    <span>🔖 My Watchlist</span>
                  </button>
                  <button
                    type="button"
                    className="user-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <span>🚪 Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="navbar-signin-btn"
              onClick={() => navigate("/login")}
              title="Sign In or Create Account"
            >
              <span className="signin-user-icon">👤</span>
              <span className="signin-label">Sign In</span>
            </button>
          )}



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
