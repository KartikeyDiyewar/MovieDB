import React from "react";
import MovieContainer from "./components/movieContainer/MovieContainer";

import Navbar from "./components/navbar/Navbar";
import "./App.css";

function App() {
  return (
    <main className="main-container">
      <Navbar />
      <MovieContainer />
    </main>
  );
}

export default App;
