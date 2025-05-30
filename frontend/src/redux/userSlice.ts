import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { apiURL } from "../lib/defines";

export interface UserState {
    loggedIn: boolean;
    isSigningIn: boolean;
    signInError: string | null;
    isSyncing: boolean;
    syncError: string | null;
}

const initialState: UserState = {
    loggedIn: false,
    isSigningIn: false,
    signInError: null,
    isSyncing: false,
    syncError: null,
};

const firebaseSignIn = createAsyncThunk(
    "user/firebaseSignIn",
    async (login: { email: string; password: string }, thunkAPI) => {
        await signInWithEmailAndPassword(firebaseAuth, login.email, login.password);
        if (!firebaseAuth.currentUser) {
            return thunkAPI.rejectWithValue("Firebase: User not authenticated");
        }
        console.log("Firebase authentication successful.");
        thunkAPI.dispatch(databaseSync());
        return true;
    },
);

const databaseSync = createAsyncThunk("user/syncDatabase", async (_, thunkAPI) => {
    const token = await firebaseAuth.currentUser?.getIdToken();
    var retries = 0;
    while (retries < 3) {
        try {
            const url = `${apiURL}/users/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            // Throw error if response not ok
            if (!response.ok) {
                const responseMessage = await response.json();
                throw new Error(responseMessage.err);
            }
            return response.json();
        } catch (error) {
            retries++;
            if (retries === 3) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(firebaseSignIn.pending, (state) => {
                state.isSigningIn = true;
                state.signInError = null;
            })
            .addCase(firebaseSignIn.fulfilled, (state) => {
                state.loggedIn = true;
                state.isSigningIn = false;
            })
            .addCase(firebaseSignIn.rejected, (state, action) => {
                state.isSigningIn = false;
                state.signInError = action.error.message || "Firebase: Sign-in failed";
            })
            .addCase(databaseSync.pending, (state) => {
                state.isSyncing = true;
                state.syncError = null;
            })
            .addCase(databaseSync.fulfilled, (state) => {
                state.isSyncing = false;
                console.log("Database sync successful");
            })
            .addCase(databaseSync.rejected, (state, action) => {
                state.isSyncing = false;
                state.syncError = action.error.message || "Database sync failed";
                console.error("Database sync error:", action.error.message);
            });
    },
});

export const userDispatch = {
    firebaseSignIn,
    databaseSync,
};
export default userSlice.reducer;
