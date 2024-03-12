import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdbapi, apiKey } from "../../api/token";

const initialState = {
  urlData: [],
  isData: false,
  searchTerm: "",
};

export const fetchMovies = createAsyncThunk("fetchMovies", async (type) => {
  try {
    const response = await tmdbapi.get(`/movie/${type}`);
    const results = response.data.results;
    return results;
  } catch (error) {
    console.log(error);
  }
});

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
      //console.log(action.payload);
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
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

export const { setSearch } = basicDataSlice.actions;

export default basicDataSlice.reducer;
