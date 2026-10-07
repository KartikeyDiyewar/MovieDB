import { useState } from "react";
import "./SimpleSearch.css";
import searchIcon from "../../assets/loupe.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  searchMovie,
  clearSearch,
} from "../../features/baseUrl/basicDataSlice";

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const { searchTerm, isSearch } = useSelector((store) => store.base);
  const [localTerm, setLocalTerm] = useState(searchTerm || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localTerm.trim()) {
      return;
    }
    dispatch(setSearch(localTerm.trim()));
    dispatch(searchMovie());
  };

  const handleClear = () => {
    setLocalTerm("");
    if (isSearch) {
      dispatch(clearSearch());
    }
  };

  return (
    <form className="search-form item1" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          value={localTerm}
          onChange={(e) => setLocalTerm(e.target.value)}
          placeholder="Search movies by title..."
          id="search-holder"
          type="text"
          autoComplete="off"
        />
        {localTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClear}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-btn" title="Search">
        <img id="search-img" src={searchIcon} alt="search" />
      </button>
    </form>
  );
};

export default SimpleSearch;
