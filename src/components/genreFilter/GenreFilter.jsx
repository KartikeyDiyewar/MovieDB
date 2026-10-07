import { useSelector, useDispatch } from "react-redux";
import {
  setGenre,
  setSelect,
  setMinRating,
  setYearEra,
} from "../../features/baseUrl/basicDataSlice";
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
  { value: 8, label: "🏆 8.0+ Top Hits" },
];

const ERA_FILTERS = [
  { value: "all", label: "All Years" },
  { value: "recent", label: "2024–2026 🆕" },
  { value: "2010s", label: "2010s Era" },
  { value: "classic", label: "Pre-2010 Classics" },
];

const GenreFilter = () => {
  const dispatch = useDispatch();
  const { genres, selectedGenre, selectTerm, mode, minRating, yearEra } =
    useSelector((state) => state.base);

  const handleCategoryClick = (categoryKey) => {
    dispatch(setSelect(categoryKey));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setGenre(genreId));
  };

  return (
    <div className="genre-filter-wrapper">
      {/* Primary Category & Genre Chips */}
      <div className="genre-filter-container">
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

        <span className="genre-divider" />

        {genres.map((g) => {
          const isActive = mode === "genre" && selectedGenre === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleGenreClick(g.id)}
              className={`genre-chip ${isActive ? "active" : ""}`}
            >
              {g.name}
            </button>
          );
        })}
      </div>

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
    </div>
  );
};

export default GenreFilter;
