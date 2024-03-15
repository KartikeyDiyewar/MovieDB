import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieCardDetails from "./pages/MovieCardDetails";

import "./App.css";

function App() {
  return (
    <main className="main-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/moviecard/:movie" element={<MovieCardDetails />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
