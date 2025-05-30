import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import journalReducer from "./journalSlice";
import { apiURL } from "../lib/defines";

export const store = configureStore({
    reducer: {
        journal: journalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
