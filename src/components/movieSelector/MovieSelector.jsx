import "./MovieSelector.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelect } from "../../features/baseUrl/basicDataSlice";

const MovieSelector = () => {
  const dispatch = useDispatch();
  const { selectTerm } = useSelector((state) => state.base);

  return (
    <select
      value={selectTerm}
      onChange={(e) => {
        dispatch(setSelect(e.target.value));
      }}
      name="movie-selector"
      className="movie-selector item3"
    >
      <option value="popular">Popular Movies</option>
      <option value="now_playing">Now Playing</option>
      <option value="top_rated">Top Rated</option>
      <option value="upcoming">Upcoming Movies</option>
    </select>
  );
};

export default MovieSelector;
