import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  searchMovie,
  fetchGenres,
  setPage,
} from "../../features/baseUrl/basicDataSlice";
import MovieCard from "../movieCard/MovieCard";
import AiSparkIcon from "../common/AiSparkIcon";
import "./MovieContainer.css";

const SKELETON_COUNT = 10;

const MovieContainer = () => {
  const dispatch = useDispatch();
  const {
    urlData,
    loading,
    loadingMore,
    error,
    selectTerm,
    selectedGenre,
    minRating,
    yearEra,
    currentPage,
    totalPages,
    mode,
    searchTerm,
    aiSearchSummary,
  } = useSelector((state) => state.base);

  const observerRef = useRef(null);

  // Load genres once on mount
  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  // Fetch movies when category, genre, filters, or page changes
  useEffect(() => {
    if (mode === "search") {
      if (searchTerm && searchTerm.trim() && !aiSearchSummary) {
        dispatch(searchMovie());
      }
    } else {
      dispatch(fetchMovies());
    }
  }, [
    dispatch,
    selectTerm,
    selectedGenre,
    minRating,
    yearEra,
    mode,
    currentPage,
    searchTerm,
    aiSearchSummary,
  ]);

  // Infinite Scroll Observer callback
  const lastMovieRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          dispatch(setPage());
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, currentPage, totalPages, dispatch]
  );

  const handleRetry = () => {
    if (mode === "search") {
      dispatch(searchMovie());
    } else {
      dispatch(fetchMovies());
    }
  };

  return (
    <section className="catalog-section">
      {mode === "search" && aiSearchSummary && (
        <div className="ai-search-summary-banner">
          <div className="ai-search-summary-icon">
            <AiSparkIcon size={16} />
          </div>
          <div className="ai-search-summary-text">
            <span className="ai-search-summary-badge">Cinema AI Reverse Search</span>
            <p>{aiSearchSummary}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <div className="error-text">
            <h4>Something went wrong</h4>
            <p>{error}</p>
          </div>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="movie-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-poster shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line short shimmer" />
            </div>
          ))}
        </div>
      )}

      {!loading && urlData.length > 0 && (
        <>
          <div className="movie-grid">
            {urlData.map((movie, index) => {
              const isLast = index === urlData.length - 1;
              return (
                <div
                  key={`${movie.id}-${index}`}
                  ref={isLast ? lastMovieRef : null}
                  className="movie-grid-item"
                >
                  <MovieCard movie={movie} />
                </div>
              );
            })}
          </div>

          {loadingMore && (
            <div className="loading-more-indicator">
              <div className="spinner" />
              <span>Loading more movies...</span>
            </div>
          )}

          {currentPage >= totalPages && totalPages > 1 && (
            <p className="end-of-results">
              You have reached the end of the catalog.
            </p>
          )}
        </>
      )}

      {!loading && !error && urlData.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No movies found</h3>
          <p>
            {mode === "search"
              ? `No results matched "${searchTerm}". Try another search term.`
              : "No movies match your selected filters. Try lowering the minimum rating or changing the era."}
          </p>
        </div>
      )}
    </section>
  );
};

export default MovieContainer;
