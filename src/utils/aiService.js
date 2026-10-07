import { tmdbapi } from "../api/token";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

/**
 * Quick prompt inspiration presets
 */
export const AI_PRESETS = [
  { label: "🧠 Mind-Bending", query: "Mind-bending movies with crazy plot twists like Inception or Shutter Island" },
  { label: "❤️ Date Night", query: "Charming, cozy romantic comedy movies for a fun couple movie night" },
  { label: "🍿 Late Night Horror", query: "Terrifying psychological horror movies with suspense and dread" },
  { label: "🔥 High-Octane Action", query: "Fast-paced adrenaline action movies like John Wick or Mad Max" },
  { label: "😂 Feel-Good Comedy", query: "Hilarious, uplifting feel-good comedies to lift your mood" },
  { label: "🕵️ Whodunit Mystery", query: "Gripping murder mystery detective movies like Knives Out" },
  { label: "🚀 Deep Space Sci-Fi", query: "Epic cosmic sci-fi space movies like Interstellar and Arrival" },
];

/**
 * Fetch AI recommendations from Groq and augment with TMDB metadata
 */
export async function getAiMovieRecommendations(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error("Please enter a question or mood for the AI");
  }

  if (!GROQ_API_KEY) {
    throw new Error(
      "Groq API key is not configured. Please add VITE_GROQ_API_KEY in your Vercel Environment Variables."
    );
  }

  // 1. Prepare system instruction
  const systemPrompt = `You are KD Moviez AI Cinema Concierge, an elite film critic and recommendation engine.
Given the user's movie taste, mood, or query, recommend 3 to 4 outstanding movies that perfectly match.
Respond STRICTLY with valid JSON following this exact schema:
{
  "summary": "1-2 engaging sentences introducing the picks with enthusiasm",
  "movies": [
    {
      "title": "Exact standard English movie title",
      "year": "YYYY",
      "reason": "1-2 sentence compelling reason why this movie fits the user's request"
    }
  ]
}`;

  let aiResponseText = "";

  // 2. Try proxy endpoint first, fallback to direct Groq API
  const endpoints = [
    "/api/groq/chat/completions",
    "https://api.groq.com/openai/v1/chat/completions",
  ];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt.trim() },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Groq API returned ${response.status}: ${errBody}`);
      }

      const data = await response.json();
      aiResponseText = data.choices?.[0]?.message?.content || "";
      if (aiResponseText) break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!aiResponseText) {
    throw new Error(
      lastError?.message || "Failed to contact Groq AI recommendation service."
    );
  }

  // 3. Parse JSON from AI response
  let parsed = null;
  try {
    parsed = JSON.parse(aiResponseText);
  } catch {
    // Attempt to extract json from markdown fences if any
    const match = aiResponseText.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error("Could not parse AI response. Please try asking again.");
    }
  }

  const rawMovies = Array.isArray(parsed.movies) ? parsed.movies : [];

  // 4. Augment with TMDB metadata (poster, id, rating, backdrop)
  const augmentedMovies = await Promise.all(
    rawMovies.map(async (m) => {
      try {
        const queryParams = m.year
          ? `/search/movie?query=${encodeURIComponent(m.title)}&year=${m.year}`
          : `/search/movie?query=${encodeURIComponent(m.title)}`;

        const tmdbRes = await tmdbapi.get(queryParams);
        let match = tmdbRes.data?.results?.[0];

        // If year-restricted search failed, retry without year
        if (!match && m.year) {
          const fallbackRes = await tmdbapi.get(
            `/search/movie?query=${encodeURIComponent(m.title)}`
          );
          match = fallbackRes.data?.results?.[0];
        }

        return {
          title: m.title,
          year: m.year || (match?.release_date ? match.release_date.slice(0, 4) : ""),
          reason: m.reason,
          tmdbId: match?.id || null,
          poster_path: match?.poster_path || null,
          backdrop_path: match?.backdrop_path || null,
          vote_average: match?.vote_average || null,
          overview: match?.overview || null,
        };
      } catch (err) {
        console.warn(`TMDB lookup failed for ${m.title}:`, err);
        return {
          title: m.title,
          year: m.year,
          reason: m.reason,
          tmdbId: null,
          poster_path: null,
          vote_average: null,
        };
      }
    })
  );

  return {
    summary: parsed.summary || "Here are personalized recommendations for you:",
    movies: augmentedMovies,
  };
}
