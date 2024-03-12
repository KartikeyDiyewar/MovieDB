import React from "react";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const imageBasePath = "https://image.tmdb.org/t/p/w500/";
  return (
    <article className="card-container">
      <img
        className="movie-poster"
        src={imageBasePath + movie.poster_path}
        alt={movie.title}
      />
      <div className="movie-text-container">
        <h4 className="movie-text">{movie.title}</h4>
        <h4 className="movie-text">{movie.vote_average.toFixed(2)}</h4>
      </div>
    </article>
  );
};

export default MovieCard;
