import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SimpleSearch from "../simpleSearch/SimpleSearch";
import titleImg from "../../assets/movie.png";
import {
  clearSearch,
  setWatchlistMode,
} from "../../features/baseUrl/basicDataSlice";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalData, isSearch, searchTerm, watchlist, mode } = useSelector(
    (store) => store.base
  );

  const handleLogoClick = () => {
    dispatch(clearSearch());
    navigate("/");
  };

  const handleWatchlistClick = () => {
    dispatch(setWatchlistMode());
    navigate("/");
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <div className="navbar-brand" onClick={handleLogoClick} title="Home">
          <img id="titleImg" src={titleImg} alt="KD Moviez Logo" />
          <span className="brand-title">KD Moviez</span>
        </div>

        <div className="navbar-search">
          <SimpleSearch />
        </div>

        <div className="navbar-actions">
          <button
            className={`navbar-watchlist-btn ${mode === "watchlist" ? "active" : ""}`}
            onClick={handleWatchlistClick}
            title="View your saved movies"
          >
            <span className="heart-icon">❤️</span>
            <span className="watchlist-label">Watchlist</span>
            {watchlist.length > 0 && (
              <span className="watchlist-count">{watchlist.length}</span>
            )}
          </button>

          {isSearch && totalData.total_results !== undefined && (
            <div className="navbar-badge">
              <span>
                &ldquo;{searchTerm}&rdquo; ({totalData.total_results})
              </span>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
