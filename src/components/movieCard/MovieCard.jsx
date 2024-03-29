import React from "react";
import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const serealizedData = JSON.stringify(movie);
  const navigate = useNavigate();
  const imageBasePath = "https://image.tmdb.org/t/p/w500/";
  return (
    <article
      className="card-container"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/moviecard/${encodeURIComponent(serealizedData)}`);
      }}
    >
      <img
        className="movie-poster"
        src={imageBasePath + movie.poster_path}
        alt={movie.title}
      />
      <div className="movie-text-container">
        <h4 className="movie-text">{movie.title}</h4>
        <h4 className="movie-text">
          <span className="star-code"> &#11088;</span>{" "}
          {movie.vote_average.toFixed(2)}
        </h4>
      </div>
    </article>
  );
};

export default MovieCard;
