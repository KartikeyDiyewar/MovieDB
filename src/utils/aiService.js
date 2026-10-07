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

/**
 * Multi-turn conversational chat with Groq and TMDB lookup
 * @param {Array<{role: string, content: string}>} messagesHistory
 */
export async function chatWithAiAssistant(messagesHistory) {
  if (!messagesHistory || messagesHistory.length === 0) {
    throw new Error("No conversation messages provided.");
  }

  if (!GROQ_API_KEY) {
    throw new Error(
      "Groq API key is not configured. Please add GROQ_API_KEY (or VITE_GROQ_API_KEY) in your Vercel Environment Variables."
    );
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

  const endpoints = [
    "/api/groq/chat/completions",
    "https://api.groq.com/openai/v1/chat/completions",
  ];

  // Prepare messages payload for Groq
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messagesHistory.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content:
        typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    })),
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
          messages: formattedMessages,
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
      lastError?.message || "Failed to contact Cinema AI service."
    );
  }

  let parsed = null;
  try {
    parsed = JSON.parse(aiResponseText);
  } catch {
    const match = aiResponseText.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      parsed = { message: aiResponseText, movieTitles: [] };
    }
  }

  const rawTitles = Array.isArray(parsed.movieTitles)
    ? parsed.movieTitles.slice(0, 4)
    : [];

  // Augment movie titles with TMDB data
  const augmentedMovies = await Promise.all(
    rawTitles.map(async (title) => {
      try {
        const tmdbRes = await tmdbapi.get(
          `/search/movie?query=${encodeURIComponent(title)}`
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

  return {
    message: parsed.message || "Here are some recommendations:",
    movies: augmentedMovies.filter((m) => m && m.title),
  };
}

/**
 * Generate AI Vibe, audience match, and trivia for a specific movie
 */
export async function getAiMovieBreakdown(movieTitle, releaseYear = "") {
  if (!movieTitle) {
    throw new Error("Movie title is required");
  }

  if (!GROQ_API_KEY) {
    throw new Error(
      "Groq API key is not configured. Please add GROQ_API_KEY (or VITE_GROQ_API_KEY) in your Vercel Environment Variables."
    );
  }

  const systemPrompt = `You are KD Cinema AI film analyst. For the given movie, provide:
1. "vibe": an array of exactly 3 punchy, evocative words describing the mood/tone (e.g. ["Hypnotic", "Kinetic", "Mind-Bending"]).
2. "targetAudience": 1 concise sentence describing who will love this movie.
3. "watchMood": 1 sentence describing the perfect setting, mood, or snack pairing for this watch.
4. "trivia": 1 fascinating, verified behind-the-scenes production fact or trivia.
Respond STRICTLY with valid JSON matching this schema:
{
  "vibe": ["Word1", "Word2", "Word3"],
  "targetAudience": "...",
  "watchMood": "...",
  "trivia": "..."
}`;

  const userContent = `Movie: ${movieTitle} ${
    releaseYear ? `(${releaseYear})` : ""
  }`;

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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.6,
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
      lastError?.message || "Failed to generate AI movie breakdown."
    );
  }

  let parsed = null;
  try {
    parsed = JSON.parse(aiResponseText);
  } catch {
    const match = aiResponseText.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error("Could not parse AI response.");
    }
  }

  return {
    vibe: Array.isArray(parsed.vibe)
      ? parsed.vibe
      : ["Cinematic", "Engaging", "Memorable"],
    targetAudience:
      parsed.targetAudience ||
      "Fans of compelling cinema and strong storytelling.",
    watchMood:
      parsed.watchMood ||
      "Dim the lights and enjoy with your favorite snack.",
    trivia:
      parsed.trivia || "A standout work in modern cinematic storytelling.",
  };
}
