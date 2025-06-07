import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { apiURL } from "../lib/defines";
import { FirebaseError } from "firebase/app";

export interface UserState {
    firebaseIsLoadedInitial: boolean;
    isLoggedIn: boolean;
    isVerified: boolean;
    isSynced: boolean;
    isSigningIn: boolean;
    signInError: string | null;
    isSigningOut: boolean;
    signOutError: string | null;
    isSigningUp: boolean;
    signUpError: string | null;
    isSyncing: boolean;
    syncError: string | null;
    isResendingVerification: boolean;
    resendVerificationStatus: string | null;
    email: string;
    name: string;
    weight: number;
}

const initialState: UserState = {
    firebaseIsLoadedInitial: false,
    isLoggedIn: false,
    isVerified: false,
    isSynced: false,
    isSigningIn: false,
    signInError: null,
    isSigningOut: false,
    signOutError: null,
    isSigningUp: false,
    signUpError: null,
    isSyncing: false,
    syncError: null,
    isResendingVerification: false,
    resendVerificationStatus: null,
    email: "",
    name: "",
    weight: 0,
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
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                if (
                    error.code == "auth/invalid-credential" ||
                    error.code == "auth/user-not-found" ||
                    error.code == "auth/wrong-password"
                ) {
                    return thunkAPI.rejectWithValue("Invalid username or password.");
                } else if (error.code == "auth/too-many-requests") {
                    return thunkAPI.rejectWithValue("Too many requests. Try again later.");
                } else if (error.code == "auth/invalid-email") {
                    return thunkAPI.rejectWithValue("Please enter your email in the format: name@example.com");
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error has occurred";
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    },
);

const databaseSync = createAsyncThunk("user/syncDatabase", async (_, thunkAPI) => {
    const token = await firebaseAuth.currentUser?.getIdToken();
    let retries = 0;
    while (retries < 3) {
        try {
            const url = `${apiURL}/users/sync`;
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

const firebaseSignOut = createAsyncThunk("user/firebaseSignOut", async (_, thunkAPI) => {
    try {
        await firebaseAuth.signOut();
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            if (error.code === "auth/no-current-user") {
                return thunkAPI.rejectWithValue("No user is currently signed in.");
            } else {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
        // Handle other types of errors
        if (error instanceof Error) {
            return thunkAPI.rejectWithValue(error.message);
        } else {
            return thunkAPI.rejectWithValue("An unexpected error has occurred during sign-out.");
        }
    }
});

const firebaseSignUp = createAsyncThunk(
    "user/firebaseSignUp",
    async (signup: { email: string; password: string; name: string }, thunkAPI) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, signup.email, signup.password);
            if (!userCredentials.user) {
                return thunkAPI.rejectWithValue("Firebase: User not authenticated");
            }
            const user = userCredentials.user;
            await sendEmailVerification(user);
            return { email: signup.email, name: signup.name };
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/email-already-in-use") {
                    return thunkAPI.rejectWithValue("Email already in use. Please try a different email.");
                } else if (error.code === "auth/invalid-email") {
                    return thunkAPI.rejectWithValue("Please enter your email in the format:name@example.com");
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error has occurred";
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    },
);

const resendVerificationEmail = createAsyncThunk("user/resendVerificationEmail", async (_, thunkAPI) => {
    const user = firebaseAuth.currentUser;
    if (!user) {
        return thunkAPI.rejectWithValue("No user is currently signed in.");
    }
    try {
        await sendEmailVerification(user);
        return true;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof FirebaseError || error instanceof Error
                ? error.message
                : "An unexpected error has occurred";
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setFirebaseLoadedInitial: (state, action) => {
            state.firebaseIsLoadedInitial = action.payload;
        },
        fetchUserFirebase: (state) => {
            const user = firebaseAuth.currentUser;
            if (user) {
                state.isLoggedIn = true;
                state.isVerified = user.emailVerified;
            } else {
                state.isLoggedIn = false;
                state.isVerified = false;
            }
        },
    },
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
            .addCase(firebaseSignOut.pending, (state) => {
                state.isSigningOut = true;
                state.signOutError = null;
            })
            .addCase(firebaseSignOut.fulfilled, (state) => {
                state.isSigningOut = false;
                state.isLoggedIn = false;
                state.isVerified = false;
                console.log("User signed out successfully");
            })
            .addCase(firebaseSignOut.rejected, (state, action) => {
                state.isSigningOut = false;
                state.signOutError = (action.payload as string) || action.error.message || "Firebase: Sign-out failed";
                console.error("Sign-out error:", action.error.message);
            })
            .addCase(firebaseSignUp.pending, (state) => {
                state.isSigningUp = true;
                state.signUpError = null;
            })
            .addCase(firebaseSignUp.fulfilled, (state, action) => {
                state.isSigningUp = false;
                state.isLoggedIn = true;
                state.email = action.payload?.email || "";
                state.name = action.payload?.name || "";
                console.log("User signed up successfully");
            })
            .addCase(firebaseSignUp.rejected, (state, action) => {
                state.isSigningUp = false;
                state.signUpError = (action.payload as string) || action.error.message || "Firebase: Sign-up failed";
                console.error("Sign-up error:", action.error.message);
            })
            .addCase(databaseSync.pending, (state) => {
                state.isSyncing = true;
                state.syncError = null;
            })
            .addCase(databaseSync.fulfilled, (state, action) => {
                state.isSyncing = false;
                state.isLoggedIn = true;
                state.isSynced = true;
                state.email = action.payload.email || "";
                state.name = action.payload.name || "";
                console.log("Database sync successful");
            })
            .addCase(databaseSync.rejected, (state, action) => {
                state.isSyncing = false;
                state.syncError = (action.payload as string) || action.error.message || "Database sync failed";
                console.error("Database sync error:", action.error.message);
            })
            .addCase(resendVerificationEmail.pending, (state) => {
                state.isResendingVerification = true;
                state.resendVerificationStatus = null;
            })
            .addCase(resendVerificationEmail.fulfilled, (state) => {
                state.isResendingVerification = false;
                state.resendVerificationStatus = "Verification email sent successfully";
                console.log("Verification email resent successfully");
            })
            .addCase(resendVerificationEmail.rejected, (state, action) => {
                state.isResendingVerification = false;
                state.resendVerificationStatus =
                    (action.payload as string) || action.error.message || "Resend verification failed";
                console.error("Resend verification error:", action.error.message);
            });
    },
});

export const userDispatch = {
    fetchUserFirebase: userSlice.actions.fetchUserFirebase,
    setFirebaseLoadedInitial: userSlice.actions.setFirebaseLoadedInitial,
    firebaseSignIn,
    firebaseSignOut,
    firebaseSignUp,
    databaseSync,
    resendVerificationEmail,
};
export default userSlice.reducer;
