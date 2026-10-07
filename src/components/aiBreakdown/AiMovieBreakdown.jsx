import { useState } from "react";
import { getAiMovieBreakdown } from "../../utils/aiService";
import "./AiMovieBreakdown.css";

const AiMovieBreakdown = ({ movieTitle, releaseYear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchInsight = async () => {
    if (data) {
      setIsOpen(!isOpen);
      return;
    }

    setIsOpen(true);
    setLoading(true);
    setError(null);

    try {
      const result = await getAiMovieBreakdown(movieTitle, releaseYear);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load film notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-breakdown-card">
      <div className="ai-breakdown-header">
        <div className="ai-breakdown-title-row">
          <div className="ai-critic-icon">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </div>
          <div className="ai-breakdown-titles">
            <h4>Cinema AI Critic Notes</h4>
            <span className="ai-critic-tag">Themes, Audience Match & Trivia</span>
          </div>
        </div>

        <button
          className={`ai-breakdown-toggle-btn ${isOpen ? "active" : ""}`}
          onClick={handleFetchInsight}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : isOpen && data
            ? "Hide Notes ▲"
            : "Film Notes ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="ai-breakdown-content">
          {loading && (
            <div className="breakdown-loading">
              <div className="breakdown-spinner" />
              <p>Analyzing film themes, critical consensus and trivia...</p>
            </div>
          )}

          {error && !loading && (
            <div className="breakdown-error">
              <p>⚠️ {error}</p>
              <button
                onClick={handleFetchInsight}
                className="breakdown-retry-btn"
              >
                Retry
              </button>
            </div>
          )}

          {data && !loading && (
            <div className="breakdown-grid">
              {/* Vibe Tags */}
              <div className="breakdown-section vibe-section">
                <span className="breakdown-label">Film Atmosphere:</span>
                <div className="vibe-tags-row">
                  {data.vibe.map((word, i) => (
                    <span key={i} className="vibe-tag-pill">
                      #{word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="breakdown-section">
                <span className="breakdown-label">Audience Match:</span>
                <p className="breakdown-text">{data.targetAudience}</p>
              </div>

              {/* Watch Mood */}
              <div className="breakdown-section">
                <span className="breakdown-label">Viewing Setting:</span>
                <p className="breakdown-text">{data.watchMood}</p>
              </div>

              {/* Trivia */}
              <div className="breakdown-section trivia-section">
                <span className="breakdown-label">Behind-the-Scenes Trivia:</span>
                <p className="breakdown-text trivia-text">{data.trivia}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiMovieBreakdown;
