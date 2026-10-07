import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setGenre,
  setSelect,
  setMinRating,
  setYearEra,
  setOttProvider,
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

const OTT_FILTERS = [
  { value: null, label: "All Streams" },
  { value: "8", label: "Netflix 🔴" },
  { value: "119", label: "Prime 🔵" },
  { value: "337", label: "Disney+ 🟡" },
  { value: "350", label: "Apple TV 🍏" },
];

const GenreFilter = () => {
  const dispatch = useDispatch();
  const {
    genres,
    selectedGenre,
    selectTerm,
    mode,
    minRating,
    yearEra,
    ottProvider,
  } = useSelector((state) => state.base);

  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const handleCategoryClick = (categoryKey) => {
    dispatch(setSelect(categoryKey));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setGenre(genreId));
  };

  const selectedGenreObj = genres.find((g) => g.id === selectedGenre);

  // Compute active advanced filters count
  const activeAdvancedCount =
    (ottProvider ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (yearEra !== "all" ? 1 : 0);

  const handleResetFilters = () => {
    dispatch(setOttProvider(null));
    dispatch(setMinRating(0));
    dispatch(setYearEra("all"));
  };

  const activeOttObj = OTT_FILTERS.find((o) => o.value === ottProvider);
  const activeRatingObj = RATING_FILTERS.find((r) => r.value === minRating);
  const activeEraObj = ERA_FILTERS.find((e) => e.value === yearEra);

  return (
    <div className="genre-filter-wrapper">
      {/* Primary Category Row - Touch-Friendly Horizontal Slider */}
      <div className="primary-categories-bar">
        {/* Horizontal Swipeable Track */}
        <div className="category-slider-track" role="tablist">
          {PRESET_CATEGORIES.map((cat) => {
            const isActive =
              mode === "category" && selectTerm === cat.id && !selectedGenre;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryClick(cat.id)}
                className={`genre-chip ${isActive ? "active" : ""}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Toolbar Controls: Genre Select + Advanced Filters Drawer Button */}
        <div className="filter-controls-row">
          {/* Genre Dropdown */}
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

          {/* Quick Active Genre Badge */}
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

          {/* All Genres Chips Expand Toggle */}
          <button
            className={`genre-toggle-pill ${showAllGenres ? "expanded" : ""}`}
            onClick={() => setShowAllGenres(!showAllGenres)}
            title="Toggle genre chips"
            aria-expanded={showAllGenres}
          >
            {showAllGenres ? "Chips ▲" : "Chips ▾"}
          </button>

          {/* Advanced Filter Drawer Button (Collapsible) */}
          <button
            className={`advanced-filters-trigger-btn ${
              activeAdvancedCount > 0 ? "has-filters" : ""
            } ${showFilterDrawer ? "open" : ""}`}
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            aria-expanded={showFilterDrawer}
            title="Stream platforms, rating, and era filters"
          >
            <span className="filter-icon">⚙️</span>
            <span className="filter-trigger-label">Filters</span>
            {activeAdvancedCount > 0 && (
              <span className="filter-trigger-badge">{activeAdvancedCount}</span>
            )}
            <span className="filter-arrow">{showFilterDrawer ? "▲" : "▾"}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips Bar (Quick 1-tap removal without opening drawer) */}
      {activeAdvancedCount > 0 && (
        <div className="active-filters-summary-bar">
          <span className="summary-label">Active:</span>
          {ottProvider && activeOttObj && (
            <span
              className="summary-filter-chip"
              onClick={() => dispatch(setOttProvider(null))}
              title="Remove stream filter"
            >
              {activeOttObj.label} <span className="chip-x">✕</span>
            </span>
          )}
          {minRating > 0 && activeRatingObj && (
            <span
              className="summary-filter-chip"
              onClick={() => dispatch(setMinRating(0))}
              title="Remove score filter"
            >
              {activeRatingObj.label} <span className="chip-x">✕</span>
            </span>
          )}
          {yearEra !== "all" && activeEraObj && (
            <span
              className="summary-filter-chip"
              onClick={() => dispatch(setYearEra("all"))}
              title="Remove era filter"
            >
              {activeEraObj.label} <span className="chip-x">✕</span>
            </span>
          )}
          <button
            type="button"
            className="summary-clear-all-btn"
            onClick={handleResetFilters}
          >
            Reset All
          </button>
        </div>
      )}

      {/* Expandable Genre Pills Grid */}
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

      {/* Advanced Quick Filters Drawer (Smooth Collapsible Drawer) */}
      {showFilterDrawer && (
        <div className="sub-filters-drawer-panel">
          <div className="drawer-header-row">
            <span className="drawer-title">Refine Movies by Stream, Score & Era</span>
            {activeAdvancedCount > 0 && (
              <button
                type="button"
                className="drawer-reset-btn"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="drawer-groups-grid">
            {/* Stream Filter */}
            <div className="filter-group">
              <span className="filter-group-label">📺 Streaming OTT:</span>
              <div className="filter-tags-row">
                {OTT_FILTERS.map((of) => (
                  <button
                    key={of.label}
                    onClick={() => dispatch(setOttProvider(of.value))}
                    className={`filter-tag ${ottProvider === of.value ? "selected" : ""}`}
                  >
                    {of.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Score Filter */}
            <div className="filter-group">
              <span className="filter-group-label">⭐ Minimum Score:</span>
              <div className="filter-tags-row">
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
            </div>

            {/* Era Filter */}
            <div className="filter-group">
              <span className="filter-group-label">⏳ Release Era:</span>
              <div className="filter-tags-row">
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
          </div>
        </div>
      )}

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
