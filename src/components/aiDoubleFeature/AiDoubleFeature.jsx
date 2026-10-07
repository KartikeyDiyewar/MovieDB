import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAiDoubleFeature } from "../../utils/aiService";
import AiSparkIcon from "../common/AiSparkIcon";
import "./AiDoubleFeature.css";

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const FALLBACK_POSTER = "https://placehold.co/342x513/111420/a5b4fc?text=No+Poster";

const AiDoubleFeature = ({ movie }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pairing, setPairing] = useState(null);
  const [error, setError] = useState(null);

  if (!movie || !movie.title) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const year = movie.release_date ? movie.release_date.split("-")[0] : "";
      const res = await getAiDoubleFeature(movie.title, year, movie.overview || "");
      setPairing(res);
    } catch (err) {
      console.error("Double feature pairing error:", err);
      setError("AI pairing is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePairClick = () => {
    if (pairing?.pairedMovie) {
      const targetId = pairing.pairedMovie.id || pairing.pairedMovie.tmdbId;
      if (targetId) {
        navigate(`/movie/${targetId}`);
      }
    }
  };

  return (
    <div className="ai-double-feature-card">
      <div className="double-feature-header">
        <div className="double-feature-title-wrap">
          <div className="double-feature-icon-badge">
            <AiSparkIcon size={18} />
          </div>
          <div>
            <h3 className="double-feature-title">AI Double-Feature Pairing</h3>
            <p className="double-feature-subtitle">
              Curate the ultimate companion film for a 2-movie cinema night
            </p>
          </div>
        </div>

        {!pairing && !loading && (
          <button
            type="button"
            className="double-feature-trigger-btn"
            onClick={handleGenerate}
          >
            <AiSparkIcon size={15} />
            <span>Pair Companion Film ✦</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="double-feature-loading">
          <div className="double-feature-spinner" />
          <p>Analyzing themes, stylistic contrasts, and narrative pacing...</p>
        </div>
      )}

      {error && <div className="double-feature-error">{error}</div>}

      {pairing && (
        <div className="double-feature-content">
          {pairing.pairedMovie && (
            <div
              className="double-feature-companion"
              onClick={handlePairClick}
              role="button"
              tabIndex={0}
              title={`View ${pairing.pairedMovie.title}`}
            >
              <div className="companion-poster-wrap">
                <img
                  src={
                    pairing.pairedMovie.poster_path
                      ? `${POSTER_BASE}${pairing.pairedMovie.poster_path}`
                      : FALLBACK_POSTER
                  }
                  alt={pairing.pairedMovie.title}
                  className="companion-poster-img"
                />
                <span className="companion-badge">✦ Companion Pick</span>
              </div>
              <div className="companion-info">
                <div className="companion-title-row">
                  <h4 className="companion-title">{pairing.pairedMovie.title}</h4>
                  {pairing.pairedMovie.vote_average && (
                    <span className="companion-rating">
                      ★ {Number(pairing.pairedMovie.vote_average).toFixed(1)}
                    </span>
                  )}
                </div>
                {pairing.pairedMovie.release_date && (
                  <span className="companion-year">
                    Released: {pairing.pairedMovie.release_date.split("-")[0]}
                  </span>
                )}
                <p className="companion-overview">
                  {pairing.pairedMovie.overview
                    ? pairing.pairedMovie.overview.slice(0, 140) + "..."
                    : "Tap to view full cast, trailer, and streaming details."}
                </p>
                <span className="companion-cta">View Film Details →</span>
              </div>
            </div>
          )}

          <div className="double-feature-insights">
            <div className="df-insight-row">
              <span className="df-insight-label">🎬 Thematic Synergy</span>
              <p className="df-insight-value">{pairing.themeConnection}</p>
            </div>
            <div className="df-insight-row">
              <span className="df-insight-label">⏳ Recommended Viewing Order</span>
              <p className="df-insight-value">{pairing.viewingOrder}</p>
            </div>
            <div className="df-insight-row">
              <span className="df-insight-label">🍿 Intermission Vibe</span>
              <p className="df-insight-value">{pairing.intermissionVibe}</p>
            </div>
          </div>

          <button
            type="button"
            className="double-feature-refresh-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            Pair Another Film ↺
          </button>
        </div>
      )}
    </div>
  );
};

export default AiDoubleFeature;
