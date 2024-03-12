import React, { useEffect } from "react";
import "./SimpleSearch.css";
import searchIcon from "../../assets/loupe.png";
import { useDispatch, useSelector } from "react-redux";
import { setSearch, searchMovie } from "../../features/baseUrl/basicDataSlice";

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((store) => store.base.searchTerm);

  return (
    <span className="search-container">
      <input
        onChange={(e) => {
          dispatch(setSearch(e.target.value));
        }}
        placeholder="Search..."
        id="search-holder"
        type="text"
      />
      <button
        onClick={() => {
          dispatch(searchMovie());
        }}
        className="search-btn"
      >
        <img id="search-img" src={searchIcon} alt="search" />
      </button>
    </span>
  );
};

export default SimpleSearch;
