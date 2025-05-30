import { createSlice } from "@reduxjs/toolkit";

export interface JournalState {
    day: string;
    dayName: string;
    apiDate: string;
    isToday?: boolean;
}

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

const initialState: JournalState = {
    day: new Date().toISOString(),
    dayName: getJournalDayName(new Date()),
    apiDate: getAPIDate(new Date()),
    isToday: true, // Default to true since the initial day is today
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
});

export const { nextDay, prevDay } = journalSlice.actions;
export default journalSlice.reducer;
