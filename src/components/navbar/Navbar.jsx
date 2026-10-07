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
              width="24"
              height="24"
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
          <button
            className="navbar-ai-btn"
            onClick={handleAiClick}
            title="Ask KD Cinema AI for personalized movie recommendations"
          >
            <span className="ai-icon">✨</span>
            <span className="ai-label">AI Genie</span>
          </button>

          <button
            className="navbar-surprise-btn"
            onClick={handleSurpriseClick}
            title="Roll the dice for a random 7+ movie recommendation"
          >
            <span className="dice-icon">🎲</span>
            <span className="surprise-label">Surprise Me</span>
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
