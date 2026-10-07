// Configurable Affiliate Tags & Referral IDs
// You can override any of these in your .env or Vercel Environment Variables:
// VITE_AMAZON_AFFILIATE_TAG=your-tag-21
// VITE_VPN_AFFILIATE_URL=https://nordvpn.com/...
// VITE_TELEGRAM_COMMUNITY_URL=https://t.me/yourchannel

export const AFFILIATE_CONFIG = {
  amazonTag: import.meta.env.VITE_AMAZON_AFFILIATE_TAG || "kdmoviez-21",
  vpnUrl:
    import.meta.env.VITE_VPN_AFFILIATE_URL ||
    "https://nordvpn.com/special/?coupon=kdmoviez",
  telegramUrl:
    import.meta.env.VITE_TELEGRAM_COMMUNITY_URL ||
    "https://t.me/+kdmoviez_community",
  buyMeCoffeeUrl:
    import.meta.env.VITE_BUY_ME_COFFEE_URL || "https://buymeacoffee.com",
};

/**
 * Generate platform-specific affiliate or direct streaming URLs
 */
export const getProviderLink = (providerName, movieTitle) => {
  if (!movieTitle) return "#";
  const encodedTitle = encodeURIComponent(movieTitle);
  const name = (providerName || "").toLowerCase();

  if (name.includes("amazon") || name.includes("prime")) {
    const isIndia = navigator?.language?.toLowerCase().includes("in");
    const domain = isIndia ? "amazon.in" : "amazon.com";
    return `https://www.${domain}/s?k=${encodedTitle}&i=instant-video&tag=${AFFILIATE_CONFIG.amazonTag}`;
  }

  if (name.includes("apple") || name.includes("itunes")) {
    return `https://tv.apple.com/search?term=${encodedTitle}`;
  }

  if (name.includes("netflix")) {
    return `https://www.netflix.com/search?q=${encodedTitle}`;
  }

  if (name.includes("hotstar") || name.includes("disney")) {
    return `https://www.hotstar.com/in/explore?search_query=${encodedTitle}`;
  }

  if (name.includes("jio")) {
    return `https://www.jiocinema.com/search/${encodedTitle}`;
  }

  if (name.includes("zee")) {
    return `https://www.zee5.com/search?q=${encodedTitle}`;
  }

  if (name.includes("google play")) {
    return `https://play.google.com/store/search?q=${encodedTitle}&c=movies`;
  }

  if (name.includes("youtube")) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
      movieTitle + " movie watch rent"
    )}`;
  }

  // Fallback JustWatch search
  return `https://www.justwatch.com/find?q=${encodedTitle}`;
};

/**
 * Theatrical ticket booking links
 */
export const getTicketBookingLink = (movieTitle) => {
  const isIndia = navigator?.language?.toLowerCase().includes("in");
  const encodedTitle = encodeURIComponent(movieTitle);
  if (isIndia) {
    return `https://in.bookmyshow.com/explore/movies?q=${encodedTitle}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(
    movieTitle + " movie tickets showtimes near me"
  )}`;
};
