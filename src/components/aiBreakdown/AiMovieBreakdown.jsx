import { useState } from "react";
import { getAiMovieBreakdown } from "../../utils/aiService";
import AiSparkIcon from "../common/AiSparkIcon";
import "./AiMovieBreakdown.css";

const AiMovieBreakdown = ({ movieTitle, releaseYear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("verdict"); // "verdict" | "ending"
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

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
      setError(err.message || "Failed to load Cinema AI notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-breakdown-card">
      <div className="ai-breakdown-header">
        <div className="ai-breakdown-title-row">
          <div className="ai-critic-icon">
            <AiSparkIcon size={16} />
          </div>
          <div className="ai-breakdown-titles">
            <h4>Cinema AI Intelligence</h4>
            <span className="ai-critic-tag">30-Sec Verdict, Vibe DNA & Ending Clues</span>
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
            ? "Hide Intelligence ▲"
            : "AI Intelligence ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="ai-breakdown-content">
          {loading && (
            <div className="breakdown-loading">
              <div className="breakdown-spinner" />
              <p>Cinema AI is analyzing narrative arcs, pacing, themes & ending clues...</p>
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
            <div className="breakdown-body">
              {/* Tab Navigation */}
              <div className="breakdown-tabs">
                <button
                  className={`breakdown-tab-btn ${activeTab === "verdict" ? "active" : ""}`}
                  onClick={() => setActiveTab("verdict")}
                >
                  ⚡ 30-Sec Verdict & DNA
                </button>
                <button
                  className={`breakdown-tab-btn ${activeTab === "ending" ? "active" : ""}`}
                  onClick={() => setActiveTab("ending")}
                >
                  👁️ Ending Explained & Clues
                </button>
              </div>

              {/* Tab 1: 30-Sec Verdict & DNA */}
              {activeTab === "verdict" && (
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

                  {/* Cinematic DNA */}
                  <div className="breakdown-section dna-section">
                    <span className="breakdown-label">Cinematic DNA:</span>
                    <p className="dna-badge">{data.cinematicDna}</p>
                  </div>

                  {/* Watch If / Skip If Grid */}
                  <div className="verdict-columns">
                    <div className="verdict-col watch-if">
                      <span className="verdict-col-label">✅ Watch If:</span>
                      <p>{data.watchIf}</p>
                    </div>
                    <div className="verdict-col skip-if">
                      <span className="verdict-col-label">🛑 Skip If:</span>
                      <p>{data.skipIf}</p>
                    </div>
                  </div>

                  {/* Pacing */}
                  <div className="breakdown-section">
                    <span className="breakdown-label">Pacing Score:</span>
                    <p className="pacing-text">{data.pacing}</p>
                  </div>

                  {/* Trivia */}
                  <div className="breakdown-section trivia-section">
                    <span className="breakdown-label">Behind-The-Scenes Trivia:</span>
                    <p className="breakdown-text trivia-text">{data.trivia}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Ending Explained & Clues (Spoiler Safe) */}
              {activeTab === "ending" && (
                <div className="ending-tab-container">
                  {!spoilerRevealed ? (
                    <div className="spoiler-shield-card">
                      <div className="spoiler-shield-icon">🔒</div>
                      <h5>Spoiler Warning</h5>
                      <p>
                        This breakdown analyzes the final act, climax, plot twists,
                        and hidden director clues.
                      </p>
                      <button
                        className="reveal-spoiler-btn"
                        onClick={() => setSpoilerRevealed(true)}
                      >
                        👁️ Reveal Ending Breakdown & Clues
                      </button>
                    </div>
                  ) : (
                    <div className="ending-revealed-content">
                      <div className="ending-header-row">
                        <span className="ending-tag">Climax & Ending Breakdown</span>
                        <button
                          className="hide-spoiler-btn"
                          onClick={() => setSpoilerRevealed(false)}
                        >
                          🔒 Hide Spoilers
                        </button>
                      </div>

                      <div className="ending-block">
                        <span className="breakdown-label">What Happened in the Ending:</span>
                        <p className="ending-text">{data.endingExplanation}</p>
                      </div>

                      {data.hiddenClues && data.hiddenClues.length > 0 && (
                        <div className="ending-block">
                          <span className="breakdown-label">
                            Subtle Director Clues You Missed:
                          </span>
                          <ul className="clues-list">
                            {data.hiddenClues.map((clue, idx) => (
                              <li key={idx} className="clue-item">
                                {clue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiMovieBreakdown;
