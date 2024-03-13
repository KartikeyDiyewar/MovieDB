import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdbapi, apiKey } from "../../api/token";

const initialState = {
  urlData: [],
  isData: false,
  searchTerm: "",
  isSearch: false,
  selectTerm: "popular",
  currentPage: 1,
};

export const fetchMovies = createAsyncThunk(
  "fetchMovies",
  async (arg, thunkAPI) => {
    const type = thunkAPI.getState().base.selectTerm;
    const page = thunkAPI.getState().base.currentPage;
    try {
      const response = await tmdbapi.get(`/movie/${type}?page=${page}`);
      const results = response.data.results;
      return results;
    } catch (error) {
      console.log(error);
    }
  }
);

export const searchMovie = createAsyncThunk(
  "searchMovie",
  async (arg, thunkAPI) => {
    const val = thunkAPI.getState().base.searchTerm;
    try {
      if (val == "") {
        alert("Enter the search");
        return Promise.reject();
      }
      const response = await tmdbapi.get(
        `/search/movie?query=${val}&api_key=${apiKey}`
      );
      const results = response.data.results;
      return results;
    } catch (error) {
      console.log(error);
    }
  }
);

export const basicDataSlice = createSlice({
  name: "base",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.isSearch = true;
      state.currentPage = 1;
      state.searchTerm = action.payload;
    },
    setSelect: (state, action) => {
      state.isSearch = false;
      state.isData = false;
      state.currentPage = 1;
      state.selectTerm = action.payload;
    },
    setPage: (state, action) => {
      state.currentPage = state.currentPage + 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      if (state.isData && state.currentPage > 1) {
        state.urlData = [...state.urlData, ...action.payload];
        return state;
      }
      state.urlData = action.payload;
      state.isData = true;
      return state;
    });
    builder
      .addCase(searchMovie.fulfilled, (state, action) => {
        state.urlData = action.payload;
        state.isData = true;
        return state;
      })
      .addCase(searchMovie.pending, (state, action) => {
        state.isData = false;
        return state;
      })
      .addCase(searchMovie.rejected, (state, action) => {
        state.isData = true;
        return state;
      });
  },
});

export const { setSearch, setSelect, setPage } = basicDataSlice.actions;

export default basicDataSlice.reducer;
