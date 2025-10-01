// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
