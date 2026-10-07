import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setGenre,
  setSelect,
  setMinRating,
  setYearEra,
  openAiModal,
} from "../../features/baseUrl/basicDataSlice";
import AiSparkIcon from "../common/AiSparkIcon";
import "./GenreFilter.css";

const PRESET_CATEGORIES = [
  { id: "popular", name: "🔥 Popular" },
  { id: "top_rated", name: "⭐ Top Rated" },
  { id: "upcoming", name: "📅 Upcoming" },
  { id: "now_playing", name: "🎬 Now Playing" },
];

const RATING_FILTERS = [
  { value: 0, label: "Any Rating" },
  { value: 7, label: "⭐ 7.0+" },
  { value: 8, label: "🏆 8.0+" },
];

const ERA_FILTERS = [
  { value: "all", label: "All Years" },
  { value: "recent", label: "2024–2026" },
  { value: "2010s", label: "2010s" },
  { value: "classic", label: "Classics" },
];

const GenreFilter = () => {
  const dispatch = useDispatch();
  const { genres, selectedGenre, selectTerm, mode, minRating, yearEra } =
    useSelector((state) => state.base);
  const [showAllGenres, setShowAllGenres] = useState(false);

  const handleCategoryClick = (categoryKey) => {
    dispatch(setSelect(categoryKey));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setGenre(genreId));
  };

  const selectedGenreObj = genres.find((g) => g.id === selectedGenre);

  return (
    <div className="genre-filter-wrapper">
      {/* Primary Category Row - Wrapped, Zero Horizontal Slider */}
      <div className="primary-categories-row">
        <div className="category-chips-grid">
          {PRESET_CATEGORIES.map((cat) => {
            const isActive =
              mode === "category" && selectTerm === cat.id && !selectedGenre;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`genre-chip ${isActive ? "active" : ""}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Genre Selector Dropdown & Pill */}
        <div className="genre-select-box">
          <div className="genre-select-wrapper">
            <select
              className="genre-dropdown-select"
              value={mode === "genre" && selectedGenre ? selectedGenre : ""}
              onChange={(e) => {
                if (e.target.value) {
                  handleGenreClick(Number(e.target.value));
                } else {
                  handleCategoryClick("popular");
                }
              }}
              aria-label="Filter movies by genre"
            >
              <option value="">🎭 All Genres ▾</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {mode === "genre" && selectedGenreObj && (
            <button
              className="genre-active-pill"
              onClick={() => handleCategoryClick("popular")}
              title="Clear genre filter"
            >
              <span>{selectedGenreObj.name}</span>
              <span className="clear-chip-x">✕</span>
            </button>
          )}

          <button
            className={`genre-toggle-pill ${showAllGenres ? "expanded" : ""}`}
            onClick={() => setShowAllGenres(!showAllGenres)}
            title="Toggle genre chips"
          >
            {showAllGenres ? "Hide ▲" : "Chips ▾"}
          </button>
        </div>
      </div>

      {/* Expandable Genre Pills Grid (Fully wrapped, no overflow) */}
      {showAllGenres && (
        <div className="all-genres-wrap-container">
          {genres.map((g) => {
            const isActive = mode === "genre" && selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleGenreClick(g.id)}
                className={`genre-chip mini ${isActive ? "active" : ""}`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Advanced Quick Filters: Rating & Era */}
      <div className="sub-filters-container">
        <div className="filter-group">
          <span className="filter-group-label">Score:</span>
          {RATING_FILTERS.map((rf) => (
            <button
              key={rf.value}
              onClick={() => dispatch(setMinRating(rf.value))}
              className={`filter-tag ${minRating === rf.value ? "selected" : ""}`}
            >
              {rf.label}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Era:</span>
          {ERA_FILTERS.map((ef) => (
            <button
              key={ef.value}
              onClick={() => dispatch(setYearEra(ef.value))}
              className={`filter-tag ${yearEra === ef.value ? "selected" : ""}`}
            >
              {ef.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Cinema Prompt Shortcut */}
      <div
        className="ai-discovery-shortcut"
        onClick={() => dispatch(openAiModal())}
        title="Open KD Cinema AI"
      >
        <div className="ai-discovery-text">
          <span className="ai-discovery-badge">
            <AiSparkIcon size={12} /> AI
          </span>
          <span>
            <strong>Cinema Assistant:</strong> Can&apos;t decide what to watch?
            Chat with our AI for recommendations, vibes, and streaming...
          </span>
        </div>
        <span className="ai-discovery-arrow">Start Chat ➔</span>
      </div>
    </div>
  );
};

export default GenreFilter;
