import React from "react";
import { useParams } from "react-router-dom";
import "./MovieCardDetails.css";

const MovieCardDetails = () => {
  const { movie } = useParams();
  const movieData = JSON.parse(movie);
  const imageBasePath = "https://image.tmdb.org/t/p/w500/";
  const date = new Date(movieData.release_date);
  const releaseDate = date.toDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <section className="movie-details-container-parent">
      <div className="movie-details-container">
        <h1 className="movie-data-title">{movieData.title.toUpperCase()}</h1>
        <img
          className="movie-poster-image"
          src={imageBasePath + movieData.poster_path}
          alt={movieData.title}
        />
        <div className="desc-container">
          <div className="release-rating-container">
            <p className="release-date">Release: {releaseDate}</p>
            <h4>
              <span> &#11088;</span> {movieData.vote_average.toFixed(2)}
            </h4>
          </div>
          <h4 className="desc-text">Description:</h4>
          <p className="desc-para">{movieData.overview}</p>
        </div>
      </div>
    </section>
  );
};

export default MovieCardDetails;
