import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdbapi } from "../../api/token";

const initialState = {
  totalData: {},
  urlData: [],
  isData: false,
  loading: false,
  loadingMore: false,
  error: null,
  searchTerm: "",
  isSearch: false,
  selectTerm: "popular",
  selectedGenre: null,
  mode: "category", // "category" | "genre" | "search"
  genres: [
    { id: 878, name: "Sci-Fi 🚀" },
    { id: 28, name: "Action 💥" },
    { id: 12, name: "Adventure 🧭" },
    { id: 16, name: "Animation 🎨" },
    { id: 35, name: "Comedy 😂" },
    { id: 80, name: "Crime 🕵️" },
    { id: 18, name: "Drama 🎭" },
    { id: 14, name: "Fantasy 🧙" },
    { id: 27, name: "Horror 👻" },
    { id: 9648, name: "Mystery 🔍" },
    { id: 10749, name: "Romance ❤️" },
    { id: 53, name: "Thriller ⚡" },
  ],
  currentPage: 1,
  totalPages: 1,
};

const appendUniqueMovies = (existingList, newResults) => {
  if (!newResults || !Array.isArray(newResults)) return existingList;
  const existingIds = new Set(existingList.map((m) => m.id));
  const filteredNew = newResults.filter((m) => m && m.id && !existingIds.has(m.id));
  return [...existingList, ...filteredNew];
};

export const fetchGenres = createAsyncThunk(
  "base/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tmdbapi.get("/genre/movie/list");
      return response.data.genres;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load genres");
    }
  }
);

export const fetchMovies = createAsyncThunk(
  "base/fetchMovies",
  async (_, { getState, rejectWithValue }) => {
    const { selectTerm, selectedGenre, currentPage, mode } = getState().base;
    try {
      let endpoint = "";
      if (mode === "genre" && selectedGenre) {
        endpoint = `/discover/movie?with_genres=${selectedGenre}&sort_by=popularity.desc&page=${currentPage}`;
      } else {
        endpoint = `/movie/${selectTerm}?page=${currentPage}`;
      }
      const response = await tmdbapi.get(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch movies");
    }
  }
);

export const searchMovie = createAsyncThunk(
  "base/searchMovie",
  async (_, { getState, rejectWithValue }) => {
    const { searchTerm, currentPage } = getState().base;
    if (!searchTerm || !searchTerm.trim()) {
      return rejectWithValue("Search query is empty");
    }
    try {
      const response = await tmdbapi.get(
        `/search/movie?query=${encodeURIComponent(searchTerm.trim())}&page=${currentPage}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to search movies");
    }
  }
);

export const basicDataSlice = createSlice({
  name: "base",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.isSearch = true;
      state.mode = "search";
      state.currentPage = 1;
      state.searchTerm = action.payload;
      state.selectedGenre = null;
      state.error = null;
    },
    setSelect: (state, action) => {
      state.isSearch = false;
      state.mode = "category";
      state.isData = false;
      state.currentPage = 1;
      state.selectTerm = action.payload;
      state.selectedGenre = null;
      state.urlData = [];
      state.error = null;
    },
    setGenre: (state, action) => {
      state.isSearch = false;
      state.mode = "genre";
      state.isData = false;
      state.currentPage = 1;
      state.selectedGenre = action.payload;
      state.urlData = [];
      state.error = null;
    },
    clearSearch: (state) => {
      state.isSearch = false;
      state.mode = "category";
      state.searchTerm = "";
      state.currentPage = 1;
      state.urlData = [];
      state.isData = false;
      state.error = null;
    },
    setPage: (state) => {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGenres
      .addCase(fetchGenres.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          // Merge custom decorated genres with TMDB genres
          const iconMap = {
            878: " 🚀",
            28: " 💥",
            12: " 🧭",
            16: " 🎨",
            35: " 😂",
            80: " 🕵️",
            18: " 🎭",
            14: " 🧙",
            27: " 👻",
            9648: " 🔍",
            10749: " ❤️",
            53: " ⚡",
          };
          state.genres = action.payload.map((g) => ({
            ...g,
            name: `${g.name}${iconMap[g.id] || ""}`,
          }));
        }
      })
      // fetchMovies
      .addCase(fetchMovies.pending, (state) => {
        if (state.currentPage === 1) {
          state.loading = true;
          state.isData = false;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        if (action.payload && action.payload.results) {
          state.totalData = action.payload;
          state.totalPages = action.payload.total_pages || 1;
          if (state.currentPage > 1) {
            state.urlData = appendUniqueMovies(state.urlData, action.payload.results);
          } else {
            state.urlData = action.payload.results;
          }
          state.isData = true;
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload || "Could not fetch movies";
      })
      // searchMovie
      .addCase(searchMovie.pending, (state) => {
        if (state.currentPage === 1) {
          state.loading = true;
          state.isData = false;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(searchMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        if (action.payload && action.payload.results) {
          state.totalData = action.payload;
          state.totalPages = action.payload.total_pages || 1;
          if (state.currentPage > 1) {
            state.urlData = appendUniqueMovies(state.urlData, action.payload.results);
          } else {
            state.urlData = action.payload.results;
          }
          state.isData = true;
        }
      })
      .addCase(searchMovie.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload || "Search failed";
      });
  },
});

export const { setSearch, setSelect, setGenre, clearSearch, setPage } =
  basicDataSlice.actions;

export default basicDataSlice.reducer;
