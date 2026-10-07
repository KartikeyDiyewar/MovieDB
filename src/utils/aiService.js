import { tmdbapi } from "../api/token";

const GROQ_API_KEY =
  import.meta.env.GROQ_API_KEY ||
  import.meta.env.VITE_GROQ_API_KEY ||
  "";

export const CHAT_STARTERS = [
  "Mind-bending thrillers with crazy plot twists",
  "Uplifting feel-good movies for a cozy evening",
  "Best high-concept sci-fi movies like Interstellar",
  "Engaging murder mysteries like Knives Out",
  "Top-rated South Indian action thrillers on OTT",
];

export const MOOD_PRESETS = [
  {
    id: "mind_bending",
    label: "Mind-Bending Twists",
    icon: "🧠",
    tagline: "Complex puzzles & shock endings",
  },
  {
    id: "zero_brainpower",
    label: "Zero Brainpower Fun",
    icon: "🍿",
    tagline: "Feel-good laughs & effortless joy",
  },
  {
    id: "high_adrenaline",
    label: "Adrenaline Rush",
    icon: "⚡",
    tagline: "Relentless momentum & edge-of-seat thrills",
  },
  {
    id: "cathartic_cry",
    label: "Deep & Cathartic",
    icon: "😭",
    tagline: "Heartfelt, poignant & emotional drama",
  },
  {
    id: "cosmic_wonder",
    label: "Cosmic & Existential",
    icon: "🌌",
    tagline: "Philosophical sci-fi & profound awe",
  },
  {
    id: "smart_whodunnit",
    label: "Smart Whodunnit",
    icon: "🕵️",
    tagline: "Witty detective secrets & tangled clues",
  },
];

/**
 * Common caller for Groq OpenAI-compatible Chat API
 */
async function callGroqApi(messages, temperature = 0.6) {
  if (!GROQ_API_KEY) {
    throw new Error(
      "Groq API key is not configured. Please add GROQ_API_KEY in your Vercel Environment Variables."
    );
  }

  const endpoints = [
    "/api/groq/chat/completions",
    "https://api.groq.com/openai/v1/chat/completions",
  ];

  let aiResponseText = "";
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
          messages,
          temperature,
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
      lastError?.message || "Failed to contact Cinema AI service."
    );
  }

  try {
    return JSON.parse(aiResponseText);
  } catch {
    const match = aiResponseText.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse AI response as JSON.");
  }
}

/**
 * Augment movie titles with live TMDB posters, ratings & IDs
 */
export async function enrichMovieTitlesWithTmdb(rawTitles) {
  if (!Array.isArray(rawTitles)) return [];
  const validTitles = rawTitles.filter((t) => typeof t === "string" && t.trim());

  return Promise.all(
    validTitles.slice(0, 6).map(async (title) => {
      try {
        const tmdbRes = await tmdbapi.get(
          `/search/movie?query=${encodeURIComponent(title.trim())}`
        );
        const match = tmdbRes.data?.results?.[0];
        return {
          title: title,
          year: match?.release_date ? match.release_date.slice(0, 4) : "",
          tmdbId: match?.id || null,
          poster_path: match?.poster_path || null,
          vote_average: match?.vote_average || null,
          overview: match?.overview || null,
        };
      } catch (err) {
        console.warn(`TMDB lookup failed for ${title}:`, err);
        return {
          title: title,
          year: "",
          tmdbId: null,
          poster_path: null,
          vote_average: null,
        };
      }
    })
  );
}

/**
 * Multi-turn conversational chat with Groq and TMDB lookup
 * @param {Array<{role: string, content: string}>} messagesHistory
 */
export async function chatWithAiAssistant(messagesHistory) {
  if (!messagesHistory || messagesHistory.length === 0) {
    throw new Error("No conversation messages provided.");
  }

  const systemPrompt = `You are KD Cinema AI, a world-class film advisor and conversational cinema assistant (built in the style of Anthropic Claude and OpenAI ChatGPT).
You communicate clearly, thoughtfully, and conversationally in English or the user's language (Hindi / Hinglish if they speak in it).
You maintain continuous memory of the ongoing conversation. If the user asks for more suggestions ("aur batao", "give me 3 more", "something lighter", "what about comedy?"), reference earlier context and suggest fresh, non-repetitive titles.
You must respond strictly in valid JSON matching this schema:
{
  "message": "Your thoughtful, conversational response directly answering the user, explaining the nuance of your picks or insights",
  "movieTitles": ["Exact Movie Title 1", "Exact Movie Title 2"]
}
If the user is asking general questions (e.g. trivia, opinions on an actor, release dates), "movieTitles" can be an empty array [].
When recommending movies, provide 2 to 4 exact recognized movie titles in the "movieTitles" array.`;

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messagesHistory.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content:
        typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    })),
  ];

  const parsed = await callGroqApi(formattedMessages, 0.7);
  const rawTitles = Array.isArray(parsed.movieTitles) ? parsed.movieTitles : [];
  const augmentedMovies = await enrichMovieTitlesWithTmdb(rawTitles);

  return {
    message: parsed.message || "Here are some recommendations:",
    movies: augmentedMovies.filter((m) => m && m.title),
  };
}

/**
 * Generate AI Vibe, 30-sec watch verdict & spoiler-safe ending breakdown
 */
export async function getAiMovieBreakdown(movieTitle, releaseYear = "") {
  if (!movieTitle) throw new Error("Movie title is required");

  const systemPrompt = `You are KD Cinema AI film analyst. For the given movie, provide a high-precision film breakdown:
1. "vibe": 3 punchy evocative words (e.g. ["Hypnotic", "Kinetic", "Mind-Bending"]).
2. "watchIf": 1 sharp sentence on who will genuinely love this film.
3. "skipIf": 1 sharp sentence on who will likely dislike or be bored by it.
4. "pacing": One of ["Fast-Paced ⚡", "Steady & Engaging 🍿", "Deliberate Slow-Burn ⏳"].
5. "cinematicDna": A comparison formula, e.g. "60% Se7en + 40% Zodiac".
6. "endingExplanation": 2-3 sentences explaining the ending, final twist, or resolution clearly.
7. "hiddenClues": Array of 2 subtle director easter eggs, clues, or motifs viewers often miss on first watch.
8. "trivia": 1 fascinating verified behind-the-scenes production trivia.

Respond strictly with valid JSON:
{
  "vibe": ["Word1", "Word2", "Word3"],
  "watchIf": "...",
  "skipIf": "...",
  "pacing": "...",
  "cinematicDna": "...",
  "endingExplanation": "...",
  "hiddenClues": ["Clue 1...", "Clue 2..."],
  "trivia": "..."
}`;

  const userContent = `Movie: ${movieTitle} ${
    releaseYear ? `(${releaseYear})` : ""
  }`;

  const parsed = await callGroqApi(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    0.6
  );

  return {
    vibe: Array.isArray(parsed.vibe)
      ? parsed.vibe
      : ["Cinematic", "Engaging", "Memorable"],
    watchIf:
      parsed.watchIf ||
      "You appreciate strong atmospheric storytelling and layered characters.",
    skipIf:
      parsed.skipIf ||
      "You dislike films that demand patient focus or leave certain details ambiguous.",
    pacing: parsed.pacing || "Steady & Engaging 🍿",
    cinematicDna: parsed.cinematicDna || "A singular vision in modern cinema",
    endingExplanation:
      parsed.endingExplanation ||
      "The climax brings together the character arcs and thematic tensions in a resonant finale.",
    hiddenClues: Array.isArray(parsed.hiddenClues)
      ? parsed.hiddenClues
      : ["Pay attention to lighting shifts in pivotal scenes.", "Key dialogue in the first act foreshadows the ending."],
    trivia:
      parsed.trivia || "A standout work in modern cinematic storytelling.",
  };
}

/**
 * AI Mood & Vibe Matcher: curates 4 standout movies for a specific psychological mood
 */
export async function getAiMoodRecommendations(moodLabel, moodTagline = "") {
  const systemPrompt = `You are KD Cinema AI Mood Curator.
The user wants movies for this specific emotional/psychological mood: "${moodLabel}" (${moodTagline}).
Curate exactly 4 distinct, celebrated films that perfectly deliver on this psychological payoff.
Respond strictly in JSON:
{
  "curatorNote": "A warm, insightful 2-sentence note explaining why these 4 films deliver this exact emotional vibe.",
  "movieTitles": ["Exact Movie Title 1", "Exact Movie Title 2", "Exact Movie Title 3", "Exact Movie Title 4"]
}`;

  const parsed = await callGroqApi([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Mood: ${moodLabel}` },
  ], 0.7);

  const rawTitles = Array.isArray(parsed.movieTitles) ? parsed.movieTitles : [];
  const augmented = await enrichMovieTitlesWithTmdb(rawTitles);

  return {
    curatorNote:
      parsed.curatorNote ||
      `Here are 4 standout films curated for the ${moodLabel} vibe.`,
    movies: augmented.filter((m) => m && m.title),
  };
}

/**
 * AI Smart Plot / Natural Language Reverse Search
 * e.g. "guy whose memory resets every 10 mins" -> Memento
 */
export async function searchMovieWithAi(naturalQuery) {
  if (!naturalQuery || !naturalQuery.trim()) return [];

  const systemPrompt = `You are KD Cinema AI Reverse Search Engine.
The user is describing a movie plot, scene, concept, or vague memory: "${naturalQuery}".
Identify the exact 3 or 4 movies they are most likely describing or that best match this description.
Respond strictly in JSON:
{
  "summary": "1 sentence summarizing what you identified",
  "movieTitles": ["Exact Movie Title 1", "Exact Movie Title 2", "Exact Movie Title 3"]
}`;

  const parsed = await callGroqApi([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Description: ${naturalQuery}` },
  ], 0.5);

  const rawTitles = Array.isArray(parsed.movieTitles) ? parsed.movieTitles : [];
  const augmented = await enrichMovieTitlesWithTmdb(rawTitles);

  return {
    summary: parsed.summary || `AI identified results for "${naturalQuery}":`,
    movies: augmented.filter((m) => m && m.title),
  };
}
