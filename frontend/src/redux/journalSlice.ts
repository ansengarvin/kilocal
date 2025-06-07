import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { apiURL } from "../lib/defines";
import { firebaseAuth } from "../lib/firebase";

export interface Food {
    id?: number;
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
    isToday?: boolean;
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
    food: Food[];
    isFetching: boolean;
    fetchError: string | null;
    isPosting: boolean;
    postError: string | null;
    isDeleting: boolean;
    deleteError: string | null;
}

const fetchDayByDate = createAsyncThunk("journal/fetchDayByDate", async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = await firebaseAuth.currentUser?.getIdToken();
    console.log(token);
    const response = await fetch(`${apiURL}/days/${state.journal.day}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.json();
});

const postFoodEntry = createAsyncThunk("journal/postFoodEntry", async (food: Food, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = await firebaseAuth.currentUser?.getIdToken();
    const queryBody = JSON.stringify(food);
    const response = await fetch(`${apiURL}/days/${state.journal.day}/food`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: queryBody,
    });
    if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error);
    }
    thunkAPI.dispatch(fetchDayByDate()); // Refresh the journal data after posting
    return response.json();
});

const deleteFoodEntry = createAsyncThunk("journal/deleteFoodEntry", async (id: Number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`${apiURL}/days/${state.journal.day}/food/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message);
    }
    thunkAPI.dispatch(fetchDayByDate()); // Refresh the journal data after deleting
    return true;
});

const initialState: JournalState = {
    day: new Date().toISOString().split("T")[0], // Start with today's date in ISO format
    dayName: getJournalDayName(new Date()),
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    food: [],
    isToday: true, // Default to true since the initial day is today
    isFetching: false,
    fetchError: null,
    isPosting: false,
    postError: null,
    isDeleting: false,
    deleteError: null,
};

export const journalSlice = createSlice({
    name: "journal",
    initialState: initialState,
    reducers: {
        nextDay(state) {
            const thisDay = new Date(state.day);
            thisDay.setDate(thisDay.getDate() + 1);
            state.day = thisDay.toISOString().split("T")[0]; // Store date in ISO format
            state.isToday = thisDay.toDateString() === new Date().toDateString();
            state.dayName = getJournalDayName(thisDay);
            console.log(`Next day: ${state.day}, isToday: ${state.isToday}, dayName: ${state.dayName}}`);
        },
        prevDay(state) {
            const thisDay = new Date(state.day);
            thisDay.setDate(thisDay.getDate() - 1);
            state.day = thisDay.toISOString().split("T")[0]; // Store date in ISO format
            // Technically the UI shouldn't allow us to go into a future day, but check this anyway
            state.isToday = thisDay.toDateString() === new Date().toDateString();
            state.dayName = getJournalDayName(thisDay);
            console.log(`Previous day: ${state.day}, isToday: ${state.isToday}, dayName: ${state.dayName}`);
        },
        clearAllErrors(state) {
            state.fetchError = null;
            state.postError = null;
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        /* Fetch day cases */
        builder
            .addCase(fetchDayByDate.pending, (state) => {
                state.isFetching = true;
                state.fetchError = null;
            })
            .addCase(fetchDayByDate.fulfilled, (state, action) => {
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
            })
            .addCase(fetchDayByDate.rejected, (state, action) => {
                state.isFetching = false;
                state.fetchError = action.error.message || "Failed to fetch journal day";
            })
            /* Post food cases */
            .addCase(postFoodEntry.pending, (state) => {
                state.isPosting = true;
                state.postError = null;
            })
            .addCase(postFoodEntry.fulfilled, (state) => {
                state.isPosting = false;
                state.postError = null;
            })
            .addCase(postFoodEntry.rejected, (state, action) => {
                state.isPosting = false;
                state.postError = action.error.message || "Failed to post food entry";
            })
            /* Delete food cases */
            .addCase(deleteFoodEntry.pending, (state) => {
                state.isDeleting = true;
                state.deleteError = null;
            })
            .addCase(deleteFoodEntry.fulfilled, (state) => {
                state.isDeleting = false;
                state.deleteError = null;
            })
            .addCase(deleteFoodEntry.rejected, (state, action) => {
                state.isDeleting = false;
                state.deleteError = action.error.message || "Failed to delete food entry";
            });
    },
});

const { nextDay, prevDay, clearAllErrors } = journalSlice.actions;

export const journalDispatch = {
    nextDay,
    prevDay,
    clearAllErrors,
    fetchDayByDate,
    postFoodEntry,
    deleteFoodEntry,
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
