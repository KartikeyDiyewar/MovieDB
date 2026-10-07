import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTrending,
  openTrailerModal,
  openAiModal,
} from "../../features/baseUrl/basicDataSlice";
import { tmdbapi } from "../../api/token";
import "./HeroBanner.css";

const HeroBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trending, mode } = useSelector((state) => state.base);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (trending.length === 0) {
      dispatch(fetchTrending());
    }
  }, [dispatch, trending.length]);

  const handleNext = useCallback(() => {
    if (trending.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % trending.length);
    }
  }, [trending.length]);

  // Auto-advance banner every 8 seconds
  useEffect(() => {
    if (trending.length === 0 || mode !== "category") return;
    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
  }, [handleNext, trending.length, mode]);

  if (mode !== "category" || trending.length === 0) {
    return null;
  }

  const movie = trending[currentIndex] || trending[0];
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const handlePlayTrailer = async () => {
    try {
      const res = await tmdbapi.get(`/movie/${movie.id}/videos`);
      const videos = res.data.results || [];
      const trailer =
        videos.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || videos[0];

      if (trailer) {
        dispatch(
          openTrailerModal({
            title: movie.title,
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

  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
      }}
    >
      <div className="hero-gradient-overlay" />

      <div className="hero-banner-content" key={movie.id}>
        <div className="hero-spotlight-tag">
          <span className="flame-icon">🔥</span> TRENDING SPOTLIGHT
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <span className="hero-rating">★ {(movie.vote_average || 0).toFixed(1)}</span>
          <span className="hero-dot">•</span>
          <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
          <span className="hero-dot">•</span>
          <span className="hero-lang">
            {(movie.original_language || "en").toUpperCase()}
          </span>
        </div>

        <p className="hero-overview">
          {movie.overview || "Explore this trending title on KD Moviez."}
        </p>

        <div className="hero-actions">
          <button className="hero-btn primary" onClick={handlePlayTrailer}>
            <span className="play-icon">▶</span> Watch Trailer
          </button>
          <button
            className="hero-btn secondary"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            ℹ Details & Streaming
          </button>
          <button
            className="hero-btn ai-btn"
            onClick={() => dispatch(openAiModal())}
            title="Ask KD Cinema AI for movie recommendations"
          >
            <svg
              width="14"
              height="14"
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
            Ask Cinema AI
          </button>
        </div>

        {/* Carousel indicator dots */}
        <div className="hero-dots">
          {trending.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot-btn ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
