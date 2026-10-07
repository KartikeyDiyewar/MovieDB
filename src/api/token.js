import axios from "axios";

export const token =
  import.meta.env.VITE_TMDB_ACCESS_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNjMxZDdmZThjODJlZjQ0ZmM5MGY4OGRkMGM5ZDczOSIsInN1YiI6IjY1OGM0MDA4YTE0ZTEwNzUxYzQ2YWZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b7CES--_e0j_PxBAzqpAcYNFYDo_34EvC87ivGA9_yM";

export const apiKey =
  import.meta.env.VITE_TMDB_API_KEY || "b631d7fe8c82ef44fc90f88dd0c9d739";

// Using /api/tmdb proxy routes through Vercel/Vite proxy to bypass regional ISP blocks without VPN
export const baseUrl = "/api/tmdb";

export const tmdbapi = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  },
});
