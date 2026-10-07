import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeCompareModal } from "../../features/baseUrl/basicDataSlice";
import { getAiMovieComparison } from "../../utils/aiService";
import AiSparkIcon from "../common/AiSparkIcon";
import "./AiMovieCompareModal.css";

const POSTER_BASE = "https://image.tmdb.org/t/p/w185";
const FALLBACK_POSTER = "https://placehold.co/185x278/111420/a5b4fc?text=No+Poster";

const AiMovieCompareModal = () => {
  const dispatch = useDispatch();
  const isCompareOpen = useSelector((state) => state.base.isCompareOpen);
  const compareMovieA = useSelector((state) => state.base.compareMovieA);

  const [movieBTitle, setMovieBTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);

  if (!isCompareOpen) return null;

  const movieATitle =
    typeof compareMovieA === "string"
      ? compareMovieA
      : compareMovieA?.title || "Film A";

  const movieAPoster =
    compareMovieA?.poster_path
      ? `${POSTER_BASE}${compareMovieA.poster_path}`
      : FALLBACK_POSTER;

  const handleClose = () => {
    setComparison(null);
    setMovieBTitle("");
    setError(null);
    dispatch(closeCompareModal());
  };

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    if (!movieBTitle.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getAiMovieComparison(movieATitle, movieBTitle.trim());
      setComparison(res);
    } catch (err) {
      console.error("Comparison failed:", err);
      setError("AI Comparison failed. Please check the movie title and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compare-modal-backdrop" onClick={handleClose}>
      <div
        className="compare-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="AI Movie Face-Off"
      >
        {/* Header */}
        <div className="compare-modal-header">
          <div className="compare-header-title-box">
            <div className="compare-header-spark">
              <AiSparkIcon size={18} />
            </div>
            <div>
              <h2 className="compare-title">AI Movie Face-Off</h2>
              <span className="compare-subtitle">Head-to-head critical cinema analysis</span>
            </div>
          </div>
          <button
            type="button"
            className="compare-close-btn"
            onClick={handleClose}
            aria-label="Close Comparison"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="compare-modal-body">
          {/* Movie Matchup Bar */}
          <div className="compare-matchup-bar">
            <div className="compare-side-card">
              <div className="compare-side-poster">
                <img src={movieAPoster} alt={movieATitle} />
              </div>
              <div className="compare-side-info">
                <span className="compare-corner-label">Current Film</span>
                <h4 className="compare-film-name">{movieATitle}</h4>
              </div>
            </div>

            <div className="compare-vs-badge">VS</div>

            <div className="compare-side-card rival-side">
              <span className="compare-corner-label">Contender</span>
              <form onSubmit={handleCompare} className="compare-input-form">
                <input
                  type="text"
                  className="compare-input-field"
                  placeholder="Enter rival movie name..."
                  value={movieBTitle}
                  onChange={(e) => setMovieBTitle(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="compare-submit-btn"
                  disabled={loading || !movieBTitle.trim()}
                >
                  <AiSparkIcon size={14} />
                  <span>{loading ? "Analyzing..." : "Compare ✦"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick suggestions pills */}
          {!comparison && !loading && (
            <div className="compare-suggestions">
              <span className="compare-sugg-label">Popular matchups:</span>
              {["Oppenheimer", "Inception", "The Dark Knight", "Blade Runner 2049", "Parasite"].map(
                (rival) => (
                  <button
                    key={rival}
                    type="button"
                    className="compare-sugg-pill"
                    onClick={() => {
                      setMovieBTitle(rival);
                    }}
                  >
                    + {rival}
                  </button>
                )
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="compare-loading-box">
              <div className="compare-spinner" />
              <p>Analyzing screenplay, visual direction, emotional weight, and pacing...</p>
            </div>
          )}

          {error && <div className="compare-error-box">{error}</div>}

          {/* Comparison Results */}
          {comparison && (
            <div className="compare-results">
              <div className="compare-contrast-card">
                <span className="contrast-label">🎨 Core Artistic Contrast</span>
                <p className="contrast-text">{comparison.coreContrast}</p>
              </div>

              <div className="compare-breakdown-grid">
                <div className="compare-point-card">
                  <div className="point-header">
                    <span className="point-icon">📖</span>
                    <span className="point-title">Story & Script</span>
                  </div>
                  <p className="point-winner">{comparison.storyWinner}</p>
                </div>

                <div className="compare-point-card">
                  <div className="point-header">
                    <span className="point-icon">🎥</span>
                    <span className="point-title">Visuals & Direction</span>
                  </div>
                  <p className="point-winner">{comparison.visualsWinner}</p>
                </div>

                <div className="compare-point-card">
                  <div className="point-header">
                    <span className="point-icon">🧠</span>
                    <span className="point-title">Emotional / Thematic Depth</span>
                  </div>
                  <p className="point-winner">{comparison.depthWinner}</p>
                </div>
              </div>

              <div className="compare-verdict-card">
                <div className="verdict-header">
                  <AiSparkIcon size={16} />
                  <span>Definitive AI Verdict</span>
                </div>
                <p className="verdict-text">{comparison.verdict}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMovieCompareModal;
