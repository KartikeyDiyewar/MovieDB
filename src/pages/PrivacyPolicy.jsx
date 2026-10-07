import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./LegalPages.css";

const PrivacyPolicy = () => {
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
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last Updated: October 2026</p>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              KD Moviez is committed to user privacy. We do not require account
              creation or login to access movie discovery, trailers, or streaming
              information. We may collect anonymous browser logs, device type,
              and interaction data to improve site performance.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Cookies & Advertising</h2>
            <p>
              We may utilize standard cookies and web beacons. Third-party
              vendors, including Google AdSense, use cookies (such as the
              DoubleClick DART cookie) to serve relevant ads based on a user&apos;s
              prior visits to this and other websites. Users may opt out of
              personalized advertising by visiting Google Ads Settings.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Third-Party Links & Affiliates</h2>
            <p>
              KD Moviez contains links to third-party streaming platforms (such as
              Netflix, Amazon Prime Video, Disney+ Hotstar, Apple TV, YouTube)
              and service providers. Clicking these links may direct you to their
              platforms, which operate under their own independent privacy
              policies.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Data Security</h2>
            <p>
              All traffic between your browser and KD Moviez is encrypted via
              Secure Socket Layer (SSL/HTTPS).
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please
              reach out via our Contact page.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
