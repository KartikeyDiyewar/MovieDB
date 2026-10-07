import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MovieCardDetails from "./pages/MovieCardDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import AboutContact from "./pages/AboutContact";

import WatchlistModal from "./components/watchlist/WatchlistModal";
import AiMovieCompareModal from "./components/aiCompare/AiMovieCompareModal";
import "./App.css";

function App() {
  return (
    <main className="main-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieCardDetails />} />
          <Route path="/moviecard/:id" element={<MovieCardDetails />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<AboutContact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <WatchlistModal />
        <AiMovieCompareModal />
      </BrowserRouter>
    </main>
  );
}

export default App;
