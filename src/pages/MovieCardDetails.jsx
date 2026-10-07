import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { tmdbapi } from "../api/token";
import {
  setToast,
  openTrailerModal,
} from "../features/baseUrl/basicDataSlice";
import Navbar from "../components/navbar/Navbar";
import MovieCard from "../components/movieCard/MovieCard";
import TrailerModal from "../components/trailerModal/TrailerModal";
import SurpriseModal from "../components/surpriseModal/SurpriseModal";
import Toast from "../components/toast/Toast";
import BackToTop from "../components/backToTop/BackToTop";
import "./MovieCardDetails.css";

const MovieCardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setProviders(null);

    window.scrollTo({ top: 0, behavior: "smooth" });

    let movieId = id;
    if (isNaN(movieId)) {
      try {
        const parsed = JSON.parse(id);
        if (parsed && parsed.id) movieId = parsed.id;
      } catch {
        // Continue with raw id
      }
    }

    Promise.all([
      tmdbapi.get(`/movie/${movieId}?append_to_response=videos,credits,similar`),
      tmdbapi.get(`/movie/${movieId}/watch/providers`).catch(() => null),
    ])
      .then(([movieRes, provRes]) => {
        if (isMounted) {
          setMovie(movieRes.data);
          if (provRes && provRes.data) {
            setProviders(provRes.data.results || {});
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load movie details");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      dispatch(setToast("Link copied to clipboard! 📋"));
    } else if (navigator.share) {
      navigator.share({
        title: movie?.title,
        url: window.location.href,
      });
    }
  };

  const handlePlayTrailer = (trailerKey) => {
    if (trailerKey) {
      dispatch(
        openTrailerModal({
          title: movie?.title,
          videoKey: trailerKey,
        })
      );
    }
  };

  const handleOpenReviews = () => {
    if (!movie?.title) return;
    const query = encodeURIComponent(`${movie.title} movie review`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  };

  if (loading) {
    return (
      <div className="details-page-wrapper">
        <Navbar />
        <div className="details-loading">
          <div className="details-spinner" />
          <p>Loading cinematic experience...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="details-page-wrapper">
        <Navbar />
        <div className="details-error-container">
          <h2>Movie not found</h2>
          <p>{error || "We could not find the movie you were looking for."}</p>
          <button onClick={() => navigate("/")} className="back-home-btn">
            ← Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const runtimeFormatted = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const topCast = (movie.credits?.cast || []).slice(0, 10);
  const similarMovies = (movie.similar?.results || []).slice(0, 6);

  const formatCurrency = (val) => {
    if (!val || val === 0) return null;
    return `$${(val / 1000000).toFixed(1)}M`;
  };

  // Watch providers: India (IN) priority, fallback to US
  const regionProviders = (providers && providers.IN) || (providers && providers.US) || {};
  const streamList = regionProviders.flatrate || [];
  const rentList = regionProviders.rent || [];
  const buyList = regionProviders.buy || [];
  const regionCode = providers?.IN ? "India 🇮🇳" : providers?.US ? "USA 🇺🇸" : "Region";

  return (
    <div className="details-page-wrapper">
      <Navbar />

      {/* Cinematic Hero Backdrop */}
      <div
        className="details-hero"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
        }}
      >
        <div className="hero-overlay" />

        <div className="details-content-wrapper">
          {/* Top Breadcrumb & Modern Back Navigation Bar */}
          <div className="details-nav-bar">
            <button
              onClick={handleBack}
              className="modern-back-btn"
              title="Return to browse"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="back-arrow-icon"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Movies</span>
            </button>

            <div className="details-breadcrumbs">
              <span onClick={() => navigate("/")} className="crumb-link">
                Home
              </span>
              <span className="crumb-sep">/</span>
              <span onClick={() => navigate("/")} className="crumb-link">
                Movies
              </span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{movie.title}</span>
            </div>
          </div>

          <div className="details-main-grid">
            {/* Left: Poster */}
            <div className="details-poster-col">
              {posterUrl ? (
                <img
                  className="details-poster"
                  src={posterUrl}
                  alt={movie.title}
                />
              ) : (
                <div className="details-poster-fallback">
                  <span>🎬</span>
                  <p>No Poster</p>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="details-info-col">
              <h1 className="details-title">{movie.title}</h1>
              {movie.tagline && (
                <p className="details-tagline">&ldquo;{movie.tagline}&rdquo;</p>
              )}

              <div className="details-meta-row">
                <span className="rating-pill">
                  ★ {(movie.vote_average || 0).toFixed(1)}
                  <small> ({movie.vote_count} votes)</small>
                </span>
                <span className="meta-dot">•</span>
                <span>{releaseYear}</span>
                {runtimeFormatted && (
                  <>
                    <span className="meta-dot">•</span>
                    <span>{runtimeFormatted}</span>
                  </>
                )}
                {movie.status && (
                  <>
                    <span className="meta-dot">•</span>
                    <span className="status-pill">{movie.status}</span>
                  </>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="details-genres">
                  {movie.genres.map((g) => (
                    <span key={g.id} className="genre-tag">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Tools Bar */}
              <div className="details-actions-bar">
                {trailer && (
                  <button
                    className="action-btn play"
                    onClick={() => handlePlayTrailer(trailer.key)}
                  >
                    ▶ Watch Trailer
                  </button>
                )}
                <button
                  className="action-btn review-btn"
                  onClick={handleOpenReviews}
                  title="Search movie reviews and video breakdowns on YouTube"
                >
                  📺 YouTube Reviews ↗
                </button>
                <button className="action-btn share-btn" onClick={handleShare}>
                  🔗 Share
                </button>
              </div>

              {/* Where to Watch / OTT Providers Section */}
              <div className="ott-providers-card">
                <div className="ott-header">
                  <span className="ott-icon">📺</span>
                  <h4>Where to Stream ({regionCode})</h4>
                </div>

                {streamList.length > 0 ? (
                  <div className="ott-platform-list">
                    <span className="ott-type-label">Subscription:</span>
                    <div className="ott-logos">
                      {streamList.map((p) => (
                        <div
                          key={p.provider_id}
                          className="provider-item"
                          title={p.provider_name}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                            alt={p.provider_name}
                            className="provider-logo"
                          />
                          <span className="provider-name">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-stream-msg">
                    Not currently streaming on subscription OTT in {regionCode}.
                    {rentList.length > 0 || buyList.length > 0
                      ? " Available for digital rent/purchase."
                      : ""}
                  </p>
                )}

                {(rentList.length > 0 || buyList.length > 0) && (
                  <div className="ott-secondary-list">
                    <span className="ott-type-label">Rent / Buy:</span>
                    <div className="ott-logos-small">
                      {[...rentList, ...buyList]
                        .filter(
                          (v, i, a) =>
                            a.findIndex((t) => t.provider_id === v.provider_id) === i
                        )
                        .slice(0, 6)
                        .map((p) => (
                          <img
                            key={p.provider_id}
                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                            alt={p.provider_name}
                            title={p.provider_name}
                            className="provider-logo-small"
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="details-overview-section">
                <h3>Overview</h3>
                <p>{movie.overview || "No overview available for this movie."}</p>
              </div>

              {/* Budget & Revenue Meta */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="financials-row">
                  {movie.budget > 0 && (
                    <div className="financial-item">
                      <span className="fin-label">Budget:</span>
                      <span className="fin-val">{formatCurrency(movie.budget)}</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="financial-item">
                      <span className="fin-label">Revenue:</span>
                      <span className="fin-val">{formatCurrency(movie.revenue)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Trailer Section */}
      {trailer && (
        <section className="trailer-section">
          <h2>Official Trailer</h2>
          <div className="trailer-embed-container">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Top Cast Section */}
      {topCast.length > 0 && (
        <section className="cast-section">
          <h2>Top Cast</h2>
          <div className="cast-grid">
            {topCast.map((actor) => (
              <div key={actor.id} className="cast-card">
                {actor.profile_path ? (
                  <img
                    className="cast-photo"
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="cast-photo-placeholder">👤</div>
                )}
                <p className="cast-name">{actor.name}</p>
                <p className="cast-character">{actor.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <section className="similar-section">
          <h2>More Like This</h2>
          <div className="similar-grid">
            {similarMovies.map((simMovie) => (
              <MovieCard key={simMovie.id} movie={simMovie} />
            ))}
          </div>
        </section>
      )}

      <TrailerModal />
      <SurpriseModal />
      <Toast />
      <BackToTop />
    </div>
  );
};

export default MovieCardDetails;
