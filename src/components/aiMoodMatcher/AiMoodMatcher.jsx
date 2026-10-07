import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MOOD_PRESETS,
  getAiMoodRecommendations,
} from "../../utils/aiService";
import { openTrailerModal } from "../../features/baseUrl/basicDataSlice";
import { tmdbapi } from "../../api/token";
import AiSparkIcon from "../common/AiSparkIcon";
import "./AiMoodMatcher.css";

const AiMoodMatcher = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeMood, setActiveMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [curatorNote, setCuratorNote] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  const handleSelectMood = async (mood) => {
    if (activeMood?.id === mood.id && movies.length > 0) {
      // Toggle off if clicking active
      setActiveMood(null);
      setMovies([]);
      setCuratorNote("");
      return;
    }

    setActiveMood(mood);
    setLoading(true);
    setError(null);

    try {
      const res = await getAiMoodRecommendations(mood.label, mood.tagline);
      setCuratorNote(res.curatorNote);
      setMovies(res.movies || []);
    } catch (err) {
      setError(err.message || "Failed to load AI recommendations for this mood.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrailer = async (tmdbId, title) => {
    if (!tmdbId) return;
    try {
      const res = await tmdbapi.get(`/movie/${tmdbId}/videos`);
      const vids = res.data?.results || [];
      const tr =
        vids.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || vids[0];

      if (tr?.key) {
        dispatch(openTrailerModal({ title, videoKey: tr.key }));
      } else {
        alert("No trailer video found for this title.");
      }
    } catch {
      alert("Unable to load trailer.");
    }
  };

  return (
    <section className="mood-matcher-section" aria-label="Cinema AI Mood Matcher">
      <div className="mood-matcher-header">
        <div className="mood-matcher-title-row">
          <div className="mood-spark-badge">
            <AiSparkIcon size={16} />
          </div>
          <div>
            <h3 className="mood-section-title">Cinema AI Mood Matcher</h3>
            <p className="mood-section-sub">
              Pick your psychological vibe tonight — AI curates the matching films.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mood-toggle-section-btn"
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          aria-expanded={isSectionOpen}
          title={isSectionOpen ? "Collapse Vibe Matcher" : "Expand Vibe Matcher"}
        >
          {isSectionOpen ? "Collapse ▲" : "Explore Vibes ▾"}
        </button>
      </div>

      {/* Collapsible Content */}
      {isSectionOpen && (
        <>
          {/* Mood Selector Chips */}
          <div className="mood-chips-container">
        {MOOD_PRESETS.map((m) => {
          const isActive = activeMood?.id === m.id;
          return (
            <button
              key={m.id}
              className={`mood-chip-btn ${isActive ? "active" : ""}`}
              onClick={() => handleSelectMood(m)}
              disabled={loading && activeMood?.id === m.id}
            >
              <span className="mood-chip-icon">{m.icon}</span>
              <div className="mood-chip-text">
                <span className="mood-chip-label">{m.label}</span>
                <span className="mood-chip-tagline">{m.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mood-loading-box">
          <div className="mood-spinner" />
          <p>Cinema AI is analyzing film themes and curating your {activeMood?.label} watchlist...</p>
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <div className="mood-error-box">
          <p>⚠️ {error}</p>
          <button
            className="mood-retry-btn"
            onClick={() => handleSelectMood(activeMood)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Curated Results Showcase */}
      {movies.length > 0 && !loading && activeMood && (
        <div className="mood-results-container">
          <div className="mood-curator-banner">
            <div className="curator-banner-left">
              <span className="curator-avatar">
                <AiSparkIcon size={15} />
              </span>
              <div>
                <span className="curator-badge">Curator Verdict • {activeMood.label}</span>
                <p className="curator-note">{curatorNote}</p>
              </div>
            </div>
            <button
              className="mood-close-results"
              onClick={() => {
                setActiveMood(null);
                setMovies([]);
              }}
              title="Close mood results"
            >
              ✕ Close
            </button>
          </div>

          <div className="mood-cards-grid">
            {movies.map((mov, idx) => {
              const posterUrl = mov.poster_path
                ? `https://image.tmdb.org/t/p/w400${mov.poster_path}`
                : null;
              const rating =
                typeof mov.vote_average === "number" && mov.vote_average > 0
                  ? mov.vote_average.toFixed(1)
                  : "NR";

              return (
                <article key={idx} className="mood-card">
                  <div
                    className="mood-card-poster-wrapper"
                    onClick={() => mov.tmdbId && navigate(`/movie/${mov.tmdbId}`)}
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={mov.title}
                        className="mood-card-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="mood-card-fallback">
                        <span>🎬</span>
                        <p>No Poster</p>
                      </div>
                    )}
                    <div className="mood-card-rating">
                      <span className="rating-star">★</span>
                      <span>{rating}</span>
                    </div>
                  </div>

                  <div className="mood-card-info">
                    <h4
                      className="mood-card-title"
                      onClick={() => mov.tmdbId && navigate(`/movie/${mov.tmdbId}`)}
                      title={mov.title}
                    >
                      {mov.title}
                    </h4>
                    {mov.year && <span className="mood-card-year">{mov.year}</span>}

                    <div className="mood-card-actions">
                      <button
                        className="mood-action-btn primary"
                        onClick={() =>
                          mov.tmdbId && navigate(`/movie/${mov.tmdbId}`)
                        }
                      >
                        ℹ Details
                      </button>
                      <button
                        className="mood-action-btn secondary"
                        onClick={() => handlePlayTrailer(mov.tmdbId, mov.title)}
                      >
                        ▶ Trailer
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
        </>
      )}
    </section>
  );
};

export default AiMoodMatcher;
