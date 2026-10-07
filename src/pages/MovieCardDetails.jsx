import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbapi } from "../api/token";
import Navbar from "../components/navbar/Navbar";
import MovieCard from "../components/movieCard/MovieCard";
import "./MovieCardDetails.css";

const MovieCardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Scroll to top upon navigation
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Validate ID: check if it's a numeric ID or fallback
    let movieId = id;
    if (isNaN(movieId)) {
      try {
        const parsed = JSON.parse(id);
        if (parsed && parsed.id) movieId = parsed.id;
      } catch {
        // Continue with raw id
      }
    }

    tmdbapi
      .get(`/movie/${movieId}?append_to_response=videos,credits,similar`)
      .then((res) => {
        if (isMounted) {
          setMovie(res.data);
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

  if (loading) {
    return (
      <div className="details-page-wrapper">
        <Navbar />
        <div className="details-loading">
          <div className="details-spinner" />
          <p>Loading movie details...</p>
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

  // Find YouTube trailer
  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const topCast = (movie.credits?.cast || []).slice(0, 8);
  const similarMovies = (movie.similar?.results || []).slice(0, 5);

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
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>

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

              <div className="details-overview-section">
                <h3>Overview</h3>
                <p>{movie.overview || "No overview available for this movie."}</p>
              </div>
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
    </div>
  );
};

export default MovieCardDetails;
