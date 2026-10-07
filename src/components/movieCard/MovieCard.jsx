import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleWatchlist } from "../../features/baseUrl/basicDataSlice";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.base.watchlist) || [];

  if (!movie) return null;

  const targetId = movie.id || movie.tmdbId;
  const isSaved = watchlist.some((m) => m.id === targetId || m.tmdbId === targetId);

  const imageBasePath = "https://image.tmdb.org/t/p/w500";
  const posterUrl = movie.poster_path
    ? `${imageBasePath}${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "NR";

  return (
    <article
      className="card-container"
      onClick={() => {
        const targetId = movie.id || movie.tmdbId;
        if (targetId) navigate(`/movie/${targetId}`);
      }}
      title={movie.title}
    >
      <div className="poster-wrapper">
        {posterUrl ? (
          <img
            className="movie-poster"
            src={posterUrl}
            alt={movie.title || "Movie poster"}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            <span>🎬</span>
            <p>No Image</p>
          </div>
        )}

        {/* Bookmark Watchlist Button */}
        <button
          type="button"
          className={`card-watchlist-btn ${isSaved ? "saved" : ""}`}
          title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
          aria-label={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleWatchlist(movie));
          }}
        >
          {isSaved ? "🔖" : "➕"}
        </button>

        {/* Rating Badge */}
        <div className="rating-badge">
          <span className="star-icon">★</span>
          <span>{rating}</span>
        </div>
      </div>

      <div className="movie-text-container">
        <h4 className="movie-title">{movie.title || "Untitled"}</h4>
        <div className="movie-meta">
          <span className="movie-year">{releaseYear}</span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
