import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { apiURL } from "../lib/defines";
import { firebaseAuth } from "../lib/firebase";

export interface Food {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    amount: number;
}

export interface JournalState {
    day: string;
    dayName: string;
    apiDate: string;
    isToday?: boolean;
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
    food: Food[];
    isFetching: boolean;
    fetchError: string | null;
}

const fetchDayByDate = createAsyncThunk("journal/fetchDayByDate", async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`${apiURL}/days/${state.journal.apiDate}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.json();
});

const initialState: JournalState = {
    day: new Date().toISOString(),
    dayName: getJournalDayName(new Date()),
    apiDate: getAPIDate(new Date()),
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    food: [],
    isToday: true, // Default to true since the initial day is today
    isFetching: false,
    fetchError: null,
};

export const journalSlice = createSlice({
    name: "journal",
    initialState: initialState,
    reducers: {
        nextDay(state) {
            const thisDay = new Date(state.day);
            thisDay.setDate(thisDay.getDate() + 1);
            state.day = thisDay.toISOString();
            state.isToday = thisDay.toDateString() === new Date().toDateString();
            state.dayName = getJournalDayName(thisDay);
            state.apiDate = getAPIDate(thisDay);
        },
        prevDay(state) {
            const thisDay = new Date(state.day);
            thisDay.setDate(thisDay.getDate() - 1);
            state.day = thisDay.toISOString();
            // Technically the UI shouldn't allow us to go into a future day, but check this anyway
            state.isToday = thisDay.toDateString() === new Date().toDateString();
            state.dayName = getJournalDayName(thisDay);
            state.apiDate = getAPIDate(thisDay);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDayByDate.pending, (state) => {
            state.isFetching = true;
            state.fetchError = null;
        });
        builder.addCase(fetchDayByDate.fulfilled, (state, action) => {
            const data = action.payload;
            state.food = data.food;
            state.totalCalories = data.totalCalories;
            state.totalCarbs = data.totalCarbs;
            state.totalProtein = data.totalProtein;
            state.totalFat = data.totalFat;
            state.isFetching = false;
            state.fetchError = null;

            // Update the day name and apiDate based on the fetched date
            const fetchedDate = new Date(state.day);
            state.dayName = getJournalDayName(fetchedDate);
            state.apiDate = getAPIDate(fetchedDate);
        });
        builder.addCase(fetchDayByDate.rejected, (state, action) => {
            state.isFetching = false;
            state.fetchError = action.error.message || "Failed to fetch journal day";
        });
    },
});

const { nextDay, prevDay } = journalSlice.actions;

export const journalDispatch = {
    nextDay,
    prevDay,
    fetchDayByDate,
};
export default journalSlice.reducer;

/*
    Helper Functions
*/
function getJournalDayName(date: Date): string {
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

function getAPIDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}
