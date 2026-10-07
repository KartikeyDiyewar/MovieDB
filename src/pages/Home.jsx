import Navbar from "../components/navbar/Navbar";
import GenreFilter from "../components/genreFilter/GenreFilter";
import MovieContainer from "../components/movieContainer/MovieContainer";

const Home = () => {
  return (
    <>
      <Navbar />
      <GenreFilter />
      <MovieContainer />
    </>
  );
};

export default Home;
