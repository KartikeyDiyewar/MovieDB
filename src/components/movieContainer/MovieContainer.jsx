import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  searchMovie,
  setPage,
} from "../../features/baseUrl/basicDataSlice";
import MovieCard from "../movieCard/MovieCard";
import "./MovieContainer.css";
import loadingImg from "../../assets/loading.png";

const MovieContainer = () => {
  const { urlData, isData, selectTerm, currentPage, isSearch } = useSelector(
    (state) => state.base
  );

  const lastElement = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSearch) {
      return;
    }
    dispatch(fetchMovies());
  }, [selectTerm, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log(entries);
        dispatch(setPage());
      }
    });
    if (lastElement.current) {
      observer.observe(lastElement.current);
    }

    return () => {
      if (lastElement.current) {
        observer.unobserve(lastElement.current);
      }
    };
  }, [urlData]);

  return (
    <>
      {isData ? (
        <div className="movie-container">
          {urlData.map((movie, index) => {
            return (
              <div className="movie-container-item" key={index}>
                <MovieCard movie={movie} />
              </div>
            );
          })}
          <span ref={lastElement}></span>
        </div>
      ) : (
        <img className="loading-icon" src={loadingImg} alt="Loading" />
      )}
    </>
  );
};

export default MovieContainer;
