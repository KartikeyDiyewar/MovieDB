import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeSurpriseModal,
  fetchSurpriseMovie,
  openTrailerModal,
} from "../../features/baseUrl/basicDataSlice";
import { tmdbapi } from "../../api/token";
import "./SurpriseModal.css";

const SurpriseModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSurpriseOpen, surpriseMovie } = useSelector((state) => state.base);

  useEffect(() => {
    if (isSurpriseOpen && !surpriseMovie) {
      dispatch(fetchSurpriseMovie());
    }
  }, [isSurpriseOpen, surpriseMovie, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") dispatch(closeSurpriseModal());
    };
    if (isSurpriseOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSurpriseOpen, dispatch]);

  if (!isSurpriseOpen) return null;

  const handleRollAgain = () => {
    dispatch(fetchSurpriseMovie());
  };

  const handleGoToMovie = () => {
    if (surpriseMovie) {
      dispatch(closeSurpriseModal());
      navigate(`/movie/${surpriseMovie.id}`);
    }
  };

  const handleWatchTrailer = async () => {
    if (!surpriseMovie) return;
    try {
      const res = await tmdbapi.get(`/movie/${surpriseMovie.id}/videos`);
      const videos = res.data.results || [];
      const trailer =
        videos.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || videos[0];

      if (trailer) {
        dispatch(closeSurpriseModal());
        dispatch(
          openTrailerModal({
            title: surpriseMovie.title,
            videoKey: trailer.key,
          })
        );
      } else {
        alert("No trailer found for this movie.");
      }
    } catch {
      alert("Unable to load trailer.");
    }
  };

  const posterUrl = surpriseMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w342${surpriseMovie.poster_path}`
    : null;

  return (
    <div
      className="surprise-modal-backdrop"
      onClick={() => dispatch(closeSurpriseModal())}
    >
      <div
        className="surprise-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="surprise-modal-header">
          <div className="surprise-title-tag">
            <span>🎲</span> KD Moviez Wheel of Fortune
          </div>
          <button
            className="surprise-close-btn"
            onClick={() => dispatch(closeSurpriseModal())}
          >
            ✕
          </button>
        </div>

        {!surpriseMovie ? (
          <div className="surprise-loading">
            <div className="surprise-spinner" />
            <p>Rolling the dice for a 7+ ⭐ hidden gem...</p>
          </div>
        ) : (
          <div className="surprise-body">
            <div className="surprise-poster-col">
              {posterUrl ? (
                <img
                  className="surprise-poster"
                  src={posterUrl}
                  alt={surpriseMovie.title}
                />
              ) : (
                <div className="surprise-poster-placeholder">🎬</div>
              )}
            </div>

            <div className="surprise-info-col">
              <span className="surprise-pick-badge">✨ Tonight&apos;s Pick</span>
              <h2 className="surprise-movie-title">{surpriseMovie.title}</h2>

              <div className="surprise-meta">
                <span className="surprise-rating">
                  ★ {(surpriseMovie.vote_average || 0).toFixed(1)}
                </span>
                <span>•</span>
                <span>{surpriseMovie.release_date?.slice(0, 4) || "N/A"}</span>
              </div>

              <p className="surprise-overview">
                {surpriseMovie.overview || "No overview available."}
              </p>

              <div className="surprise-actions">
                <button
                  className="surprise-btn primary"
                  onClick={handleGoToMovie}
                >
                  View Details & Streaming 🎬
                </button>
                <button
                  className="surprise-btn secondary"
                  onClick={handleWatchTrailer}
                >
                  ▶ Trailer
                </button>
                <button
                  className="surprise-btn outline"
                  onClick={handleRollAgain}
                >
                  🎲 Roll Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurpriseModal;
