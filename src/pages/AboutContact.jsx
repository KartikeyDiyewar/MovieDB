import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./LegalPages.css";

const AboutContact = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-wrapper">
      <Navbar />
      <div className="legal-content-container">
        <div className="legal-back-nav">
          <button onClick={() => navigate("/")} className="legal-back-btn">
            ← Back to Catalog
          </button>
        </div>

        <article className="legal-article">
          <h1>About & Contact</h1>
          <p className="legal-updated">About KD Moviez</p>

          <section className="legal-section">
            <h2>Our Mission</h2>
            <p>
              KD Moviez was built to provide movie enthusiasts with a clean,
              ultra-fast, modern cinema guide without login friction, intrusive
              popups, or clunky navigation. We help users find where movies are
              streaming across India and global OTT platforms (Netflix, Prime
              Video, Disney+ Hotstar, JioCinema, Zee5, Apple TV).
            </p>
          </section>

          <section className="legal-section">
            <h2>Features</h2>
            <ul>
              <li>
                <strong>Where to Stream:</strong> Real-time OTT platform finder
                powered by TMDB & JustWatch.
              </li>
              <li>
                <strong>Surprise Me:</strong> Curated 7.0+ hidden gem
                recommendation wheel.
              </li>
              <li>
                <strong>Trailers & Cast:</strong> Official YouTube trailers,
                reviews, and actor filmographies.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Get in Touch / Business Inquiries</h2>
            <p>
              For sponsorships, feature requests, affiliate partnerships, or
              DMCA inquiries, reach out to the developer:
            </p>
            <div className="contact-card">
              <p>
                <strong>Developer:</strong> Kartikey Diyewar
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:diyavarkartikeya@gmail.com"
                  style={{ color: "#818cf8" }}
                >
                  diyavarkartikeya@gmail.com
                </a>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a
                  href="https://github.com/KartikeyDiyewar/MovieDB"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#818cf8" }}
                >
                  KartikeyDiyewar/MovieDB
                </a>
              </p>
            </div>
          </section>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default AboutContact;
