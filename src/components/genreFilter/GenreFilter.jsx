import { useSelector, useDispatch } from "react-redux";
import {
  setGenre,
  setSelect,
} from "../../features/baseUrl/basicDataSlice";
import "./GenreFilter.css";

const PRESET_CATEGORIES = [
  { id: "popular", name: "🔥 Popular", isCategory: true },
  { id: "top_rated", name: "⭐ Top Rated", isCategory: true },
  { id: "upcoming", name: "📅 Upcoming", isCategory: true },
  { id: "now_playing", name: "🎬 Now Playing", isCategory: true },
];

const GenreFilter = () => {
  const dispatch = useDispatch();
  const { genres, selectedGenre, selectTerm, mode } = useSelector(
    (state) => state.base
  );

  const handleCategoryClick = (categoryKey) => {
    dispatch(setSelect(categoryKey));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setGenre(genreId));
  };

  return (
    <div className="genre-filter-wrapper">
      <div className="genre-filter-container">
        {PRESET_CATEGORIES.map((cat) => {
          const isActive = mode === "category" && selectTerm === cat.id;
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
    </div>
  );
};

export default GenreFilter;
