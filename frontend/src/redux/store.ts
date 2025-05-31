import { configureStore } from "@reduxjs/toolkit";
import journalReducer from "./journalSlice";
import userReducer from "./userSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        journal: journalReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
