import { Link } from "react-router-dom";
import { AFFILIATE_CONFIG } from "../../utils/affiliate";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Community Alert Bar */}
        <div className="footer-community-card">
          <div className="community-info">
            <span className="community-icon">🍿</span>
            <div>
              <h4>Never miss a trending movie or OTT release</h4>
              <p>
                Get curated weekend watchlists, OTT streaming alerts, and
                hidden gems directly on Telegram.
              </p>
            </div>
          </div>
          <a
            href={AFFILIATE_CONFIG.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="community-join-btn"
          >
            Join Community on Telegram ↗
          </a>
        </div>

        {/* Main Footer Links & Info */}
        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <span className="footer-brand-title">
              KD<span className="brand-highlight">MOVIEZ</span>
            </span>
            <p className="footer-tagline">
              Your modern cinema discovery engine and OTT streaming finder.
              Browse trending titles, stream providers, trailers, and ratings.
            </p>
            <div className="footer-support-row">
              <a
                href={AFFILIATE_CONFIG.buyMeCoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="coffee-btn"
              >
                ☕ Support KD Moviez
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h5>Explore</h5>
            <ul>
              <li>
                <Link to="/">Home Catalog</Link>
              </li>
              <li>
                <Link to="/#popular">Popular Movies</Link>
              </li>
              <li>
                <Link to="/#top_rated">Top Rated</Link>
              </li>
              <li>
                <Link to="/#upcoming">Upcoming Releases</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5>Legal & Info</h5>
            <ul>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/about">About & Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="footer-bottom-bar">
          <p className="tmdb-attribution">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB. Streaming availability data is powered by JustWatch / TMDB.
          </p>
          <p className="affiliate-disclosure">
            Disclosure: KD Moviez participates in affiliate partner programs
            including Amazon Associates and streaming partners. We may earn a
            small commission on qualifying digital purchases/subscriptions at no
            extra cost to you.
          </p>
          <div className="footer-copyright-row">
            <span>
              &copy; {new Date().getFullYear()} KD Moviez. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
