import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./LegalPages.css";

const Terms = () => {
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
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last Updated: October 2026</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using KD Moviez, you agree to comply with and be
              bound by these Terms of Service. If you do not agree, please do not
              use this website.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Content & Movie Metadata Disclaimer</h2>
            <p>
              KD Moviez is an informational discovery catalog. All movie metadata,
              titles, overviews, ratings, and imagery are provided for
              educational and informational purposes via The Movie Database (TMDB)
              API. This site is not endorsed or certified by TMDB.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. No Video Hosting (DMCA)</h2>
            <p>
              KD Moviez does NOT host, upload, or store any full-length video files
              or copyrighted media on its servers. Video trailers are embedded
              directly from official YouTube channels via the standard YouTube
              player API.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Affiliate Disclosures</h2>
            <p>
              KD Moviez may include affiliate links. When you click on third-party
              streaming links (e.g., Amazon Prime Video, Apple TV, VPN services)
              and complete a transaction, we may receive a commission at no
              additional cost to you.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
