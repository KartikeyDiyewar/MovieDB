import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeWatchlist, toggleWatchlist, clearWatchlist } from "../../features/baseUrl/basicDataSlice";
import { getAiWatchlistAnalysis } from "../../utils/aiService";
import AiSparkIcon from "../common/AiSparkIcon";
import "./WatchlistModal.css";

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const FALLBACK_POSTER = "https://placehold.co/342x513/111420/a5b4fc?text=No+Poster";

const WatchlistModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWatchlistOpen = useSelector((state) => state.base.isWatchlistOpen);
  const watchlist = useSelector((state) => state.base.watchlist) || [];

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  if (!isWatchlistOpen) return null;

  const handleClose = () => {
    dispatch(closeWatchlist());
  };

  const handleMovieClick = (movieId) => {
    dispatch(closeWatchlist());
    navigate(`/movie/${movieId}`);
  };

  const handleAnalyzeTaste = async () => {
    if (watchlist.length === 0) return;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const titles = watchlist.map((m) => m.title).filter(Boolean);
      const res = await getAiWatchlistAnalysis(titles);
      setAnalysis(res);
    } catch (err) {
      console.error("Taste analysis failed:", err);
      setAnalysisError("AI Taste Analysis temporarily unavailable. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="watchlist-modal-backdrop" onClick={handleClose}>
      <div
        className="watchlist-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your Watchlist"
      >
        {/* Header */}
        <div className="watchlist-modal-header">
          <div className="watchlist-header-title-box">
            <span className="watchlist-badge-icon">🔖</span>
            <div>
              <h2 className="watchlist-title">Your Cinema Watchlist</h2>
              <span className="watchlist-counter">
                {watchlist.length} {watchlist.length === 1 ? "film" : "films"} saved locally
              </span>
            </div>
          </div>
          <button
            type="button"
            className="watchlist-close-btn"
            onClick={handleClose}
            aria-label="Close Watchlist"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="watchlist-modal-body">
          {watchlist.length === 0 ? (
            <div className="watchlist-empty-state">
              <div className="watchlist-empty-icon">🎬</div>
              <h3>Your Watchlist is empty</h3>
              <p>
                Browse movies and tap the <strong>🔖 Bookmark</strong> button on any card to save it here. Once you have a few saved, unlock your <strong>AI Taste Persona & Night Planner</strong>!
              </p>
            </div>
          ) : (
            <>
              {/* Action Toolbar */}
              <div className="watchlist-actions-bar">
                <button
                  type="button"
                  className="watchlist-ai-analyze-btn"
                  onClick={handleAnalyzeTaste}
                  disabled={analyzing}
                >
                  <AiSparkIcon size={16} />
                  <span>{analyzing ? "Analyzing Taste..." : "Analyze My Cinema Taste ✦"}</span>
                </button>
                <button
                  type="button"
                  className="watchlist-clear-btn"
                  onClick={() => dispatch(clearWatchlist())}
                >
                  Clear All
                </button>
              </div>

              {/* AI Taste Analysis Card */}
              {analyzing && (
                <div className="watchlist-ai-loading">
                  <div className="watchlist-ai-spinner" />
                  <p>AI is analyzing your cinema genome &amp; tonight&apos;s picks...</p>
                </div>
              )}

              {analysisError && (
                <div className="watchlist-ai-error">{analysisError}</div>
              )}

              {analysis && !analyzing && (
                <div className="watchlist-ai-report">
                  <div className="watchlist-report-header">
                    <div className="watchlist-archetype-tag">
                      <AiSparkIcon size={14} />
                      <span>{analysis.archetype}</span>
                    </div>
                  </div>

                  <p className="watchlist-roast-text">&ldquo;{analysis.roastOrPraise}&rdquo;</p>

                  {analysis.dnaBreakdown && analysis.dnaBreakdown.length > 0 && (
                    <div className="watchlist-dna-tags">
                      {analysis.dnaBreakdown.map((dna, idx) => (
                        <span key={idx} className="watchlist-dna-pill">
                          {dna}
                        </span>
                      ))}
                    </div>
                  )}

                  {analysis.recommendedFirst && (
                    <div className="watchlist-recommend-callout">
                      <div className="watchlist-recommend-title">
                        🎯 Watch Tonight: <strong>{analysis.recommendedFirst}</strong>
                      </div>
                      <p className="watchlist-recommend-why">{analysis.whyWatchFirst}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Movie Grid */}
              <div className="watchlist-grid">
                {watchlist.map((movie) => {
                  const posterUrl = movie.poster_path
                    ? `${POSTER_BASE}${movie.poster_path}`
                    : FALLBACK_POSTER;
                  const year = movie.release_date
                    ? movie.release_date.split("-")[0]
                    : "";
                  const rating = movie.vote_average
                    ? Number(movie.vote_average).toFixed(1)
                    : null;

                  return (
                    <div
                      key={movie.id}
                      className="watchlist-item-card"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <div className="watchlist-poster-wrap">
                        <img
                          src={posterUrl}
                          alt={movie.title}
                          loading="lazy"
                          className="watchlist-poster-img"
                        />
                        {rating && (
                          <div className="watchlist-item-rating">★ {rating}</div>
                        )}
                        <button
                          type="button"
                          className="watchlist-remove-btn"
                          title="Remove from Watchlist"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleWatchlist(movie));
                          }}
                          aria-label={`Remove ${movie.title} from watchlist`}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="watchlist-item-info">
                        <h4 className="watchlist-item-title">{movie.title}</h4>
                        {year && <span className="watchlist-item-year">{year}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistModal;
