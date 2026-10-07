import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tmdbapi } from "../../api/token";
import {
  setSearch,
  searchMovie,
  clearSearch,
  setAiSearchResults,
} from "../../features/baseUrl/basicDataSlice";
import { searchMovieWithAi } from "../../utils/aiService";
import AiSparkIcon from "../common/AiSparkIcon";
import "./SimpleSearch.css";

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTerm, isSearch } = useSelector((store) => store.base);
  const [localTerm, setLocalTerm] = useState(searchTerm || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
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

  // Debounced autocomplete query (for standard title mode only)
  useEffect(() => {
    if (isAiMode || !localTerm || localTerm.trim().length < 2) {
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
  }, [localTerm, isAiMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = localTerm.trim();
    if (!query) return;

    setIsDropdownOpen(false);

    if (isAiMode) {
      // AI Reverse Plot Search
      setIsAiSearching(true);
      try {
        const aiRes = await searchMovieWithAi(query);
        dispatch(
          setAiSearchResults({
            results: aiRes.movies,
            query: query,
            summary: aiRes.summary,
          })
        );
        navigate("/");
      } catch (err) {
        console.error("AI Search error:", err);
        // Fallback to normal search
        dispatch(setSearch(query));
        dispatch(searchMovie());
        navigate("/");
      } finally {
        setIsAiSearching(false);
      }
    } else {
      // Standard TMDB search
      dispatch(setSearch(query));
      dispatch(searchMovie());
      navigate("/");
    }
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
      <form
        className={`search-form item1 ${isAiMode ? "ai-active" : ""}`}
        onSubmit={handleSubmit}
      >
        {/* AI Mode Toggle Pill */}
        <button
          type="button"
          className={`search-ai-toggle ${isAiMode ? "active" : ""}`}
          onClick={() => setIsAiMode(!isAiMode)}
          title={
            isAiMode
              ? "Switch to standard title search"
              : "Switch to AI plot & scene reverse search"
          }
        >
          <AiSparkIcon size={13} />
          <span className="search-ai-text">{isAiMode ? "AI Search" : "AI"}</span>
        </button>

        <div className="search-input-wrapper">
          <input
            value={localTerm}
            onChange={(e) => setLocalTerm(e.target.value)}
            onFocus={() => {
              if (!isAiMode && suggestions.length > 0) setIsDropdownOpen(true);
            }}
            placeholder={
              isAiMode
                ? "Describe any plot or scene... (AI finds it)"
                : "Search movies..."
            }
            id="search-holder"
            type="text"
            autoComplete="off"
            disabled={isAiSearching}
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

        <button
          type="submit"
          className={`search-btn ${isAiMode ? "ai-submit" : ""}`}
          title={isAiMode ? "Run AI reverse plot search" : "Search"}
          disabled={isAiSearching}
        >
          {isAiSearching ? (
            <div className="search-btn-spinner" />
          ) : (
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
          )}
        </button>
      </form>

      {/* Autocomplete Dropdown Preview */}
      {!isAiMode && isDropdownOpen && suggestions.length > 0 && (
        <div className="search-dropdown">
          {suggestions.map((m) => {
            const thumb = m.poster_path
              ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
              : null;
            const year = m.release_date
              ? m.release_date.slice(0, 4)
              : "";
            return (
              <div
                key={m.id}
                className="dropdown-item"
                onClick={() => handleSelectSuggestion(m)}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={m.title}
                    className="dropdown-thumb"
                  />
                ) : (
                  <div className="dropdown-thumb-placeholder">🎬</div>
                )}
                <div className="dropdown-meta">
                  <span className="dropdown-title">{m.title}</span>
                  {year && <span className="dropdown-year">{year}</span>}
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
