import Navbar from "../components/navbar/Navbar";
import HeroBanner from "../components/heroBanner/HeroBanner";
import GenreFilter from "../components/genreFilter/GenreFilter";
import AiMoodMatcher from "../components/aiMoodMatcher/AiMoodMatcher";
import MovieContainer from "../components/movieContainer/MovieContainer";
import AdBanner from "../components/ads/AdBanner";
import Footer from "../components/footer/Footer";
import TrailerModal from "../components/trailerModal/TrailerModal";
import SurpriseModal from "../components/surpriseModal/SurpriseModal";
import AiModal from "../components/aiModal/AiModal";
import Toast from "../components/toast/Toast";
import BackToTop from "../components/backToTop/BackToTop";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <GenreFilter />
      <AiMoodMatcher />
      <MovieContainer />
      <AdBanner />
      <Footer />
      <TrailerModal />
      <SurpriseModal />
      <AiModal />
      <Toast />
      <BackToTop />
    </>
  );
};

export default Home;
