import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeAiModal,
  openTrailerModal,
} from "../../features/baseUrl/basicDataSlice";
import { tmdbapi } from "../../api/token";
import { chatWithAiAssistant, CHAT_STARTERS } from "../../utils/aiService";
import AiSparkIcon from "../common/AiSparkIcon";
import "./AiModal.css";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Hello. I'm your cinema assistant. Ask me for recommendations, explore specific themes, find where to stream, or ask for more anytime.",
  movies: [],
};

const AiModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAiModalOpen } = useSelector((state) => state.base);

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiModalOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isAiModalOpen, loading]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") dispatch(closeAiModal());
    };
    if (isAiModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isAiModalOpen, dispatch]);

  if (!isAiModalOpen) return null;

  const handleSendMessage = async (userPrompt) => {
    const promptToSend = (userPrompt || inputQuery).trim();
    if (!promptToSend || loading) return;

    setInputQuery("");
    setError(null);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: promptToSend,
      movies: [],
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build conversation history for Groq
      const historyPayload = newMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.text,
        }));

      const response = await chatWithAiAssistant(historyPayload);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: response.message,
        movies: response.movies || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err.message || "Failed to generate response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setInputQuery("");
  };

  const handleMovieClick = (tmdbId) => {
    if (tmdbId) {
      dispatch(closeAiModal());
      navigate(`/movie/${tmdbId}`);
    }
  };

  const handleTrailerClick = async (tmdbId, title) => {
    if (!tmdbId) return;
    try {
      const res = await tmdbapi.get(`/movie/${tmdbId}/videos`);
      const videos = res.data?.results || [];
      const trailer =
        videos.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || videos[0];

      if (trailer) {
        dispatch(closeAiModal());
        dispatch(
          openTrailerModal({
            title: title,
            videoKey: trailer.key,
          })
        );
      } else {
        alert("No trailer found for this movie.");
      }
    } catch {
      alert("Unable to fetch trailer.");
    }
  };

  return (
    <div
      className="ai-modal-backdrop"
      onClick={() => dispatch(closeAiModal())}
    >
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header - Claude/ChatGPT Minimalist Aesthetic */}
        <div className="ai-modal-header">
          <div className="ai-header-left">
            <div className="ai-header-icon">
              <AiSparkIcon size={18} />
            </div>
            <div className="ai-header-titles">
              <h3>KD Cinema AI</h3>
              <span className="ai-model-badge">Conversational Assistant</span>
            </div>
          </div>

          <div className="ai-header-actions">
            {messages.length > 1 && (
              <button
                className="ai-reset-btn"
                onClick={handleResetChat}
                title="Start a new conversation thread"
              >
                New Chat ↺
              </button>
            )}
            <button
              className="ai-close-btn"
              onClick={() => dispatch(closeAiModal())}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="ai-chat-thread">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ai-message-row ${msg.role === "user" ? "user-row" : "assistant-row"}`}
            >
              {msg.role === "assistant" && (
                <div className="ai-avatar">
                  <AiSparkIcon size={14} />
                </div>
              )}

              <div className="ai-bubble-container">
                <div className={`ai-message-bubble ${msg.role}`}>
                  <p className="ai-bubble-text">{msg.text}</p>
                </div>

                {/* If Assistant recommended movie cards */}
                {msg.movies && msg.movies.length > 0 && (
                  <div className="ai-movie-cards-grid">
                    {msg.movies.map((m, idx) => {
                      const posterUrl = m.poster_path
                        ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                        : null;

                      return (
                        <div key={idx} className="ai-chat-card">
                          <div
                            className="ai-card-poster-col"
                            onClick={() => handleMovieClick(m.tmdbId)}
                          >
                            {posterUrl ? (
                              <img
                                src={posterUrl}
                                alt={m.title}
                                className="ai-card-poster"
                                loading="lazy"
                              />
                            ) : (
                              <div className="ai-card-placeholder">🎬</div>
                            )}
                          </div>

                          <div className="ai-card-info-col">
                            <h5
                              className="ai-card-title"
                              onClick={() => handleMovieClick(m.tmdbId)}
                            >
                              {m.title}
                            </h5>

                            <div className="ai-card-meta">
                              {m.year && <span>{m.year}</span>}
                              {m.vote_average && (
                                <span className="ai-card-rating">
                                  ★ {m.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>

                            <div className="ai-card-actions">
                              {m.tmdbId ? (
                                <button
                                  className="ai-card-btn primary"
                                  onClick={() => handleMovieClick(m.tmdbId)}
                                >
                                  Details 🎬
                                </button>
                              ) : (
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent(
                                    m.title + " movie where to watch"
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ai-card-btn primary"
                                >
                                  Search ↗
                                </a>
                              )}

                              {m.tmdbId && (
                                <button
                                  className="ai-card-btn secondary"
                                  onClick={() =>
                                    handleTrailerClick(m.tmdbId, m.title)
                                  }
                                >
                                  ▶ Trailer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="ai-message-row assistant-row">
              <div className="ai-avatar">
                <span>AI</span>
              </div>
              <div className="ai-typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="ai-chat-error">
              <p>⚠️ {error}</p>
              <button
                className="ai-chat-retry-btn"
                onClick={() => handleSendMessage()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Quick Starters (shown when chat just began) */}
          {messages.length === 1 && !loading && (
            <div className="ai-starters-section">
              <span className="starters-label">Suggested prompts:</span>
              <div className="starters-grid">
                {CHAT_STARTERS.map((starter, i) => (
                  <button
                    key={i}
                    className="starter-chip"
                    onClick={() => handleSendMessage(starter)}
                  >
                    {starter} ➔
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Follow-up chips (shown when assistant has answered) */}
          {messages.length > 1 && !loading && !error && (
            <div className="ai-followup-chips">
              <button
                className="followup-chip"
                onClick={() => handleSendMessage("Suggest 3 more different movies")}
              >
                + Suggest more
              </button>
              <button
                className="followup-chip"
                onClick={() => handleSendMessage("Which of these has the best reviews?")}
              >
                Which is highest rated?
              </button>
              <button
                className="followup-chip"
                onClick={() => handleSendMessage("Give me something lighter / comedy")}
              >
                Something lighter
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Input Bar */}
        <div className="ai-input-container">
          <form
            className="ai-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="ai-chat-input"
              placeholder="Ask anything... e.g. 'aur movies batao' or 'films like Dune'..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={loading || !inputQuery.trim()}
              title="Send message"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiModal;
