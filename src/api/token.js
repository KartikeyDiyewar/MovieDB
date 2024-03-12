import axios from "axios";

export const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YmIwN2RmZmQwYTJhMGJhM2NiNjA3NWVmOTU2MmRiOSIsInN1YiI6IjY1OGM0MDA4YTE0ZTEwNzUxYzQ2YWZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w9_iJGH778EU7-YCXgPmE65ITZ5WyH34sMV2gXSwsbs";

export const apiKey = "6bb07dffd0a2a0ba3cb6075ef9562db9";

export const baseUrl = "https://api.themoviedb.org/3";

export const tmdbapi = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
