import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tmdbapi } from "../../api/token";
import {
  setSearch,
  searchMovie,
  clearSearch,
} from "../../features/baseUrl/basicDataSlice";
import "./SimpleSearch.css";

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTerm, isSearch } = useSelector((store) => store.base);
  const [localTerm, setLocalTerm] = useState(searchTerm || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced autocomplete query
  useEffect(() => {
    if (!localTerm || localTerm.trim().length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await tmdbapi.get(
          `/search/movie?query=${encodeURIComponent(localTerm.trim())}&page=1`
        );
        const topResults = (res.data.results || []).slice(0, 5);
        setSuggestions(topResults);
        setIsDropdownOpen(topResults.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localTerm.trim()) return;
    setIsDropdownOpen(false);
    dispatch(setSearch(localTerm.trim()));
    dispatch(searchMovie());
    navigate("/");
  };

  const handleClear = () => {
    setLocalTerm("");
    setSuggestions([]);
    setIsDropdownOpen(false);
    if (isSearch) {
      dispatch(clearSearch());
    }
  };

  const handleSelectSuggestion = (movie) => {
    setIsDropdownOpen(false);
    setLocalTerm(movie.title);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="search-wrapper" ref={searchContainerRef}>
      <form className="search-form item1" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            value={localTerm}
            onChange={(e) => setLocalTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsDropdownOpen(true);
            }}
            placeholder="Search movies..."
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {/* Autocomplete Dropdown Preview */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="search-dropdown">
          {suggestions.map((m) => {
            const thumb = m.poster_path
              ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
              : null;
            const year = m.release_date
              ? new Date(m.release_date).getFullYear()
              : "N/A";
            const rating = m.vote_average ? m.vote_average.toFixed(1) : "NR";

            return (
              <div
                key={m.id}
                className="search-dropdown-item"
                onClick={() => handleSelectSuggestion(m)}
              >
                {thumb ? (
                  <img
                    className="dropdown-thumb"
                    src={thumb}
                    alt={m.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="dropdown-thumb-placeholder">🎬</div>
                )}
                <div className="dropdown-info">
                  <span className="dropdown-title">{m.title}</span>
                  <div className="dropdown-meta">
                    <span>{year}</span>
                    <span>•</span>
                    <span className="dropdown-rating">★ {rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SimpleSearch;
