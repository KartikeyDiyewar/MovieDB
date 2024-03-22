import axios from "axios";

export const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNjMxZDdmZThjODJlZjQ0ZmM5MGY4OGRkMGM5ZDczOSIsInN1YiI6IjY1OGM0MDA4YTE0ZTEwNzUxYzQ2YWZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b7CES--_e0j_PxBAzqpAcYNFYDo_34EvC87ivGA9_yM";

export const apiKey = "b631d7fe8c82ef44fc90f88dd0c9d739";

export const baseUrl = "https://api.themoviedb.org/3";

export const tmdbapi = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
