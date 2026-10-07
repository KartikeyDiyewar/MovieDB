import Navbar from "../components/navbar/Navbar";
import HeroBanner from "../components/heroBanner/HeroBanner";
import GenreFilter from "../components/genreFilter/GenreFilter";
import MovieContainer from "../components/movieContainer/MovieContainer";
import TrailerModal from "../components/trailerModal/TrailerModal";
import SurpriseModal from "../components/surpriseModal/SurpriseModal";
import Toast from "../components/toast/Toast";
import BackToTop from "../components/backToTop/BackToTop";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <GenreFilter />
      <MovieContainer />
      <TrailerModal />
      <SurpriseModal />
      <Toast />
      <BackToTop />
    </>
  );
};

export default Home;
