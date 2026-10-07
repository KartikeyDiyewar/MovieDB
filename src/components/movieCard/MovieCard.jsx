import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  if (!movie) return null;

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
      onClick={() => navigate(`/movie/${movie.id}`)}
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
