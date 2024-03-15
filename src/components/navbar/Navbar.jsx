import React from "react";
import "./Navbar.css";
import MovieSelector from "../movieSelector/MovieSelector";
import SimpleSearch from "../simpleSearch/SimpleSearch";
import titleImg from "../../assets/movie.png";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { totalData } = useSelector((store) => store.base);
  return (
    <nav className="navbar">
      <SimpleSearch />
      <div className="title-container">
        <h3>
          <img id="titleImg" src={titleImg} alt="titleImg" />
          KD Moviez
        </h3>
        <span id="total-num">Results: {totalData.total_results}</span>
      </div>
      <MovieSelector />
    </nav>
  );
};

export default Navbar;
