import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeAiModal,
  openTrailerModal,
} from "../../features/baseUrl/basicDataSlice";
import { tmdbapi } from "../../api/token";
import { getAiMovieRecommendations, AI_PRESETS } from "../../utils/aiService";
import "./AiModal.css";

const AiModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAiModalOpen } = useSelector((state) => state.base);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") dispatch(closeAiModal());
    };
    if (isAiModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isAiModalOpen, dispatch]);

  if (!isAiModalOpen) return null;

  const handleSearch = async (queryToRun) => {
    const prompt = queryToRun || inputQuery;
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getAiMovieRecommendations(prompt);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate AI recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetQuery) => {
    setInputQuery(presetQuery);
    handleSearch(presetQuery);
  };

  const handleMovieClick = (tmdbId) => {
    if (tmdbId) {
      dispatch(closeAiModal());
      navigate(`/movie/${tmdbId}`);
    }
  };

  const handleTrailerClick = async (tmdbId, title) => {
    if (!tmdbId) return;
    try {
      const res = await tmdbapi.get(`/movie/${tmdbId}/videos`);
      const videos = res.data?.results || [];
      const trailer =
        videos.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || videos[0];

      if (trailer) {
        dispatch(closeAiModal());
        dispatch(
          openTrailerModal({
            title: title,
            videoKey: trailer.key,
          })
        );
      } else {
        alert("No trailer found for this movie.");
      }
    } catch {
      alert("Unable to fetch trailer.");
    }
  };

  return (
    <div
      className="ai-modal-backdrop"
      onClick={() => dispatch(closeAiModal())}
    >
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-title-row">
            <span className="ai-sparkle-icon">✨</span>
            <div className="ai-title-text">
              <h3>KD Cinema AI Genie</h3>
              <span className="ai-powered-by">Powered by Groq High-Speed LLM</span>
            </div>
          </div>
          <button
            className="ai-close-btn"
            onClick={() => dispatch(closeAiModal())}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Input Bar */}
        <div className="ai-search-container">
          <form
            className="ai-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="text"
              className="ai-query-input"
              placeholder="E.g. 'Mind-bending sci-fi with time loops' or 'Romantic movie for rainy evening'..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="ai-submit-btn"
              disabled={loading || !inputQuery.trim()}
            >
              {loading ? "Thinking..." : "Ask AI 🚀"}
            </button>
          </form>

          {/* Quick Preset Chips */}
          <div className="ai-preset-chips">
            <span className="chips-label">Try asking:</span>
            <div className="chips-scroll">
              {AI_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-chip"
                  onClick={() => handlePresetClick(p.query)}
                  disabled={loading}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body / Results */}
        <div className="ai-modal-body">
          {loading && (
            <div className="ai-loading-state">
              <div className="ai-spinner" />
              <p className="ai-loading-text">
                Consulting cinema intelligence on Groq...
              </p>
              <span className="ai-loading-subtext">
                Analyzing plot dynamics, critic consensus, and streaming catalogs
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="ai-error-box">
              <span className="ai-error-icon">⚠️</span>
              <div>
                <p className="ai-error-msg">{error}</p>
                <button
                  className="ai-retry-btn"
                  onClick={() => handleSearch()}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <div className="ai-results-wrapper">
              <div className="ai-summary-card">
                <span className="ai-badge">AI Recommendation</span>
                <p className="ai-summary-text">{result.summary}</p>
              </div>

              <div className="ai-movies-list">
                {result.movies.map((m, idx) => {
                  const posterUrl = m.poster_path
                    ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                    : null;

                  return (
                    <div key={idx} className="ai-movie-card">
                      <div
                        className="ai-movie-poster-col"
                        onClick={() => handleMovieClick(m.tmdbId)}
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={m.title}
                            className="ai-movie-poster"
                            loading="lazy"
                          />
                        ) : (
                          <div className="ai-poster-placeholder">🎬</div>
                        )}
                      </div>

                      <div className="ai-movie-info-col">
                        <div className="ai-movie-title-row">
                          <h4
                            className="ai-movie-title"
                            onClick={() => handleMovieClick(m.tmdbId)}
                          >
                            {m.title}
                          </h4>
                          {m.year && (
                            <span className="ai-movie-year">({m.year})</span>
                          )}
                          {m.vote_average && (
                            <span className="ai-rating-pill">
                              ★ {m.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="ai-movie-reason-box">
                          <span className="reason-label">Why this fits:</span>
                          <p className="reason-text">{m.reason}</p>
                        </div>

                        <div className="ai-movie-actions">
                          {m.tmdbId ? (
                            <button
                              className="ai-action-btn primary"
                              onClick={() => handleMovieClick(m.tmdbId)}
                            >
                              Stream & Details 🎬
                            </button>
                          ) : (
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(
                                m.title + " movie where to watch"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ai-action-btn primary"
                            >
                              Search Movie ↗
                            </a>
                          )}

                          {m.tmdbId && (
                            <button
                              className="ai-action-btn secondary"
                              onClick={() =>
                                handleTrailerClick(m.tmdbId, m.title)
                              }
                            >
                              ▶ Trailer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="ai-empty-state">
              <span className="empty-icon">🍿</span>
              <h4>What are you in the mood for?</h4>
              <p>
                Describe any vibe, plot twist, actor, or genre. Our Groq AI
                scours cinema history to pick the perfect films for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiModal;
