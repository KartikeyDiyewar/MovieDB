import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeTrailerModal } from "../../features/baseUrl/basicDataSlice";
import "./TrailerModal.css";

const TrailerModal = () => {
  const dispatch = useDispatch();
  const activeTrailer = useSelector((state) => state.base.activeTrailer);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(closeTrailerModal());
      }
    };
    if (activeTrailer) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeTrailer, dispatch]);

  if (!activeTrailer) return null;

  return (
    <div
      className="trailer-modal-backdrop"
      onClick={() => dispatch(closeTrailerModal())}
    >
      <div
        className="trailer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trailer-modal-header">
          <h3>{activeTrailer.title || "Trailer"}</h3>
          <button
            className="trailer-modal-close"
            onClick={() => dispatch(closeTrailerModal())}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="trailer-modal-player">
          {activeTrailer.videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailer.videoKey}?autoplay=1`}
              title={`${activeTrailer.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="no-trailer-msg">
              <p>No video trailer available for this title.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
