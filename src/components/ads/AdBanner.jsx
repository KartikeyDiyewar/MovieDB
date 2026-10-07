import { useEffect, useRef } from "react";
import { AFFILIATE_CONFIG } from "../../utils/affiliate";
import "./AdBanner.css";

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID || "";

const AdBanner = ({ slot, format = "auto", type = "inline" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (ADSENSE_CLIENT && slot && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.debug("AdSense render suppressed", e);
      }
    }
  }, [slot]);

  // If real AdSense client ID exists, render actual Google Ad tag
  if (ADSENSE_CLIENT && slot) {
    return (
      <div className={`ad-container ${type}`} ref={adRef}>
        <span className="ad-badge">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // High-converting affiliate sponsor banner fallback
  return (
    <div className={`ad-container native-sponsor ${type}`}>
      <div className="sponsor-content">
        <div className="sponsor-tag-row">
          <span className="ad-badge">Sponsored Deal</span>
          <span className="sponsor-highlight">Special Offer 🔥</span>
        </div>
        <div className="sponsor-body">
          <div className="sponsor-text">
            <h4>Stream 10,000+ Movies & TV Shows</h4>
            <p>
              Get 30 days of Amazon Prime Video with ad-free streaming, 4K HDR,
              and instant free deliveries.
            </p>
          </div>
          <a
            href={`https://www.amazon.com/amazonprime?tag=${AFFILIATE_CONFIG.amazonTag}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sponsor-cta-btn"
          >
            Start Free Trial ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
