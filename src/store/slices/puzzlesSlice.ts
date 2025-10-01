// src/store/counterSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ApiResponse } from "../../types/api.type";
import type { IPuzzleData } from "../../types/puzzles.type";

interface CounterState {
  compound_fen: string | null;
  optimal_num_moves: number | null;
  moves_used: number;
  is_solved: boolean;
  remaining_tries: number;
  time: number;
  loading: boolean;
}

const initialState: CounterState = {
  compound_fen: null,
  optimal_num_moves: null,
  moves_used: 0,
  is_solved: false,
  remaining_tries: 8,
  time: 0,
  loading: false,
};

export const getPuzzle = createAsyncThunk<
  ApiResponse<IPuzzleData>,
  void,
  { rejectValue: string }
>("puzzles/getPuzzle", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const puzzlesSlice = createSlice({
  name: "puzzles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPuzzle.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPuzzle.fulfilled, (state, action) => {
        state.loading = false;
        state.compound_fen = action.payload;
      });
  },
});

export default puzzlesSlice.reducer;
