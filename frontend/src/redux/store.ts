import { configureStore } from "@reduxjs/toolkit";
import journalReducer from "./journalSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        journal: journalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
