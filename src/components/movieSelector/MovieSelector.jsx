import React, { useEffect } from "react";
import "./MovieSelector.css";
import { useDispatch } from "react-redux";
import { fetchMovies } from "../../features/baseUrl/basicDataSlice";

const MovieSelector = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMovies("popular"));
  }, []);
  return (
    <select
      onChange={(e) => {
        // console.log(e.target.value);
        dispatch(fetchMovies(e.target.value));
      }}
      name="movie-selector"
      id="movie-selector"
      defaultValue="popular"
    >
      <option value="popular">Popular Movies</option>
      <option value="now_playing">Now Playing</option>
      <option value="top_rated">Top Rated</option>
      <option value="upcoming">Upcoming Movies</option>
    </select>
  );
};

export default MovieSelector;
