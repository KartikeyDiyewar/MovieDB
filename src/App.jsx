import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MovieCardDetails from "./pages/MovieCardDetails";

import "./App.css";

function App() {
  return (
    <main className="main-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieCardDetails />} />
          <Route path="/moviecard/:id" element={<MovieCardDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
