import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdbapi } from "../../api/token";

const initialState = {
  totalData: {},
  urlData: [],
  trending: [],
  isData: false,
  loading: false,
  loadingMore: false,
  error: null,
  searchTerm: "",
  isSearch: false,
  selectTerm: "popular",
  selectedGenre: null,
  minRating: 0, // 0 | 7 | 8
  yearEra: "all", // "all" | "recent" | "2010s" | "classic"
  mode: "category", // "category" | "genre" | "search"
  toastMessage: null,
  activeTrailer: null, // { title: string, videoKey: string } | null
  surpriseMovie: null,
  isSurpriseOpen: false,
  isAiModalOpen: false,
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

export const fetchTrending = createAsyncThunk(
  "base/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tmdbapi.get("/trending/movie/week");
      return response.data.results.slice(0, 5);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load trending movies");
    }
  }
);

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

export const fetchSurpriseMovie = createAsyncThunk(
  "base/fetchSurpriseMovie",
  async (_, { getState, rejectWithValue }) => {
    const { selectedGenre } = getState().base;
    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      let endpoint = `/discover/movie?sort_by=popularity.desc&vote_average.gte=7.2&vote_count.gte=300&page=${randomPage}`;
      if (selectedGenre) {
        endpoint += `&with_genres=${selectedGenre}`;
      }
      const response = await tmdbapi.get(endpoint);
      const results = response.data.results || [];
      if (results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        return results[randomIndex];
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to find surprise movie");
    }
  }
);

export const fetchMovies = createAsyncThunk(
  "base/fetchMovies",
  async (_, { getState, rejectWithValue }) => {
    const { selectTerm, selectedGenre, currentPage, mode, minRating, yearEra } =
      getState().base;
    try {
      let endpoint = "";
      const hasCustomFilters = minRating > 0 || yearEra !== "all";

      if (mode === "genre" || hasCustomFilters) {
        let params = [`page=${currentPage}`, "vote_count.gte=80"];

        if (selectedGenre) {
          params.push(`with_genres=${selectedGenre}`);
        }

        if (minRating > 0) {
          params.push(`vote_average.gte=${minRating}`);
          params.push("sort_by=vote_average.desc");
        } else {
          params.push("sort_by=popularity.desc");
        }

        if (yearEra === "recent") {
          params.push("primary_release_date.gte=2024-01-01");
        } else if (yearEra === "2010s") {
          params.push("primary_release_date.gte=2010-01-01");
          params.push("primary_release_date.lte=2019-12-31");
        } else if (yearEra === "classic") {
          params.push("primary_release_date.lte=2009-12-31");
        }

        endpoint = `/discover/movie?${params.join("&")}`;
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
    setMinRating: (state, action) => {
      state.minRating = action.payload;
      state.currentPage = 1;
      state.urlData = [];
      state.isData = false;
    },
    setYearEra: (state, action) => {
      state.yearEra = action.payload;
      state.currentPage = 1;
      state.urlData = [];
      state.isData = false;
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
    setToast: (state, action) => {
      state.toastMessage = action.payload;
    },
    clearToast: (state) => {
      state.toastMessage = null;
    },
    openTrailerModal: (state, action) => {
      state.activeTrailer = action.payload;
    },
    closeTrailerModal: (state) => {
      state.activeTrailer = null;
    },
    openSurpriseModal: (state) => {
      state.isSurpriseOpen = true;
    },
    closeSurpriseModal: (state) => {
      state.isSurpriseOpen = false;
      state.surpriseMovie = null;
    },
    openAiModal: (state) => {
      state.isAiModalOpen = true;
    },
    closeAiModal: (state) => {
      state.isAiModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTrending
      .addCase(fetchTrending.fulfilled, (state, action) => {
        if (action.payload) {
          state.trending = action.payload;
        }
      })
      // fetchGenres
      .addCase(fetchGenres.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
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
      // fetchSurpriseMovie
      .addCase(fetchSurpriseMovie.fulfilled, (state, action) => {
        state.surpriseMovie = action.payload;
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

export const {
  setSearch,
  setSelect,
  setGenre,
  setMinRating,
  setYearEra,
  clearSearch,
  setPage,
  setToast,
  clearToast,
  openTrailerModal,
  closeTrailerModal,
  openSurpriseModal,
  closeSurpriseModal,
  openAiModal,
  closeAiModal,
} = basicDataSlice.actions;

export default basicDataSlice.reducer;
