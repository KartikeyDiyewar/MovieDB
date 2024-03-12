import React from "react";
import { useSelector } from "react-redux";
import MovieCard from "../movieCard/MovieCard";
import "./MovieContainer.css";
import loadingImg from "../../assets/loading.png";

const MovieContainer = () => {
  const { urlData, isData } = useSelector((state) => state.base);

  return (
    <>
      {isData ? (
        <div className="movie-container">
          {urlData.map((movie, index) => {
            return (
              <div className="movie-container-item" key={index}>
                <MovieCard movie={urlData[index]} />
              </div>
            );
          })}
        </div>
      ) : (
        <img className="loading-icon" src={loadingImg} alt="Loading" />
      )}
    </>
  );
};

export default MovieContainer;
