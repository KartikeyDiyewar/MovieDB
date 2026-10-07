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
      setError(err.message || "Failed to load AI vibe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-breakdown-card">
      <div className="ai-breakdown-header">
        <div className="ai-breakdown-title-row">
          <span className="ai-wand-icon">✨</span>
          <div className="ai-breakdown-titles">
            <h4>KD Cinema AI Vibe Check</h4>
            <span className="ai-critic-tag">Instant Critic Breakdown & Trivia</span>
          </div>
        </div>

        <button
          className={`ai-breakdown-toggle-btn ${isOpen ? "active" : ""}`}
          onClick={handleFetchInsight}
          disabled={loading}
        >
          {loading ? "Analyzing..." : isOpen && data ? "Hide Breakdown ▲" : "✨ Analyze Vibe ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="ai-breakdown-content">
          {loading && (
            <div className="breakdown-loading">
              <div className="breakdown-spinner" />
              <p>Groq AI is reviewing plot themes, critical reception & trivia...</p>
            </div>
          )}

          {error && !loading && (
            <div className="breakdown-error">
              <p>⚠️ {error}</p>
              <button onClick={handleFetchInsight} className="breakdown-retry-btn">
                Retry
              </button>
            </div>
          )}

          {data && !loading && (
            <div className="breakdown-grid">
              {/* Vibe Tags */}
              <div className="breakdown-section vibe-section">
                <span className="breakdown-label">🎬 3-Word Vibe:</span>
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
                <span className="breakdown-label">👥 Who Will Love This:</span>
                <p className="breakdown-text">{data.targetAudience}</p>
              </div>

              {/* Watch Mood */}
              <div className="breakdown-section">
                <span className="breakdown-label">🍿 Best Watch Setting:</span>
                <p className="breakdown-text">{data.watchMood}</p>
              </div>

              {/* Trivia */}
              <div className="breakdown-section trivia-section">
                <span className="breakdown-label">💡 Behind-the-Scenes Trivia:</span>
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
