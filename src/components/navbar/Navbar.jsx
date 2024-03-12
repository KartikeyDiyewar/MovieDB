import React from "react";
import "./Navbar.css";
import MovieSelector from "../movieSelector/MovieSelector";
import SimpleSearch from "../simpleSearch/SimpleSearch";

const Navbar = () => {
  return (
    <nav className="navbar">
      <SimpleSearch />
      <h3>🔥KD Moviez🔥</h3>
      <MovieSelector />
    </nav>
  );
};

export default Navbar;
