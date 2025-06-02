// See: https://firebase.google.com/docs/emulator-suite/connect_auth

process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
import admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword } from "firebase/auth";

// #TODO: Right now, there's a big gap in testing the user onboarding process.
// See https://github.com/ansengarvin/kilocal/issues/36 for a larger discussion.

admin.initializeApp({
    projectId: "ag-kilocal",
});

export async function createFirebaseTestUser(email: string, password: string) {
    // Edge case: delete user if one exists with the same email, in case cleanup failed for some reason
    try {
        await admin
            .auth()
            .getUserByEmail(email)
            .then((u) => admin.auth().deleteUser(u.uid));
    } catch {
        // There was no user to delete, but that's fine - We just proceed.
    }
    // Create user
    const user = await admin.auth().createUser({ email, password, emailVerified: true });
    if (!user) {
        console.error("Failed to create firebase testuser");
        throw new Error("Failed to create firebase test user");
    }
    return user;
}

export async function deleteFirebaseTestUser(email: string) {
    // Delete if exists
    try {
        await admin
            .auth()
            .getUserByEmail(email)
            .then((u) => admin.auth().deleteUser(u.uid));
    } catch {
        console.log("User does not exist");
    }
}

let clientAppInitialized = false;

export async function getUserIdToken(email: string, password: string): Promise<string> {
    if (!clientAppInitialized) {
        initializeClientApp({
            apiKey: "fakeKey",
            authDomain: "localhost",
            projectId: "ag-kilocal",
        });
        clientAppInitialized = true;
    }
    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user) {
        console.error("User credential is null");
        throw new Error("User credential is null");
    }
    const token = await userCredential.user.getIdToken();
    if (!token) {
        console.error("Token is null");
        throw new Error("Token is null");
    }
    return userCredential.user.getIdToken();
}
