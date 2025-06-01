import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { apiURL } from "../lib/defines";

export interface UserState {
    isLoggedIn: boolean;
    isVerified: boolean;
    isSigningIn: boolean;
    signInError: string | null;
    isSyncing: boolean;
    syncError: string | null;
}

const initialState: UserState = {
    isLoggedIn: false,
    isVerified: false,
    isSigningIn: false,
    signInError: null,
    isSyncing: false,
    syncError: null,
};

const firebaseSignIn = createAsyncThunk(
    "user/firebaseSignIn",
    async (login: { email: string; password: string }, thunkAPI) => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, login.email, login.password);
            if (!firebaseAuth.currentUser) {
                return thunkAPI.rejectWithValue("Firebase: User not authenticated");
            }
            if (firebaseAuth.currentUser.emailVerified) {
                thunkAPI.dispatch(databaseSync());
            }
            return true;
        } catch (error: any) {
            if (error.name == "FirebaseError") {
                if (error.code == "auth/invalid-credential" || error.code == "auth/user-not-found") {
                    return thunkAPI.rejectWithValue("Invalid username or password.");
                } else if (error.code == "auth/too-many-requests") {
                    return thunkAPI.rejectWithValue("Too many requests. Try again later.");
                } else if (error.code == "auth/invalid-email") {
                    return thunkAPI.rejectWithValue("Please enter your email in the format: name@example.com");
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            } else {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
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
                state.isSigningIn = false;
                state.isLoggedIn = true;
                state.isVerified = firebaseAuth.currentUser?.emailVerified || false;
            })
            .addCase(firebaseSignIn.rejected, (state, action) => {
                state.isSigningIn = false;
                state.signInError = (action.payload as string) || action.error.message || "Firebase: Sign-in failed";
            })
            .addCase(databaseSync.pending, (state) => {
                state.isSyncing = true;
                state.syncError = null;
            })
            .addCase(databaseSync.fulfilled, (state) => {
                state.isSyncing = false;
                state.isLoggedIn = false;
                console.log("Database sync successful");
            })
            .addCase(databaseSync.rejected, (state, action) => {
                state.isSyncing = false;
                state.syncError = (action.payload as string) || action.error.message || "Database sync failed";
                console.error("Database sync error:", action.error.message);
            });
    },
});

export const userDispatch = {
    firebaseSignIn,
    databaseSync,
};
export default userSlice.reducer;
