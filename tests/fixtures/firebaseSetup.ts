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
    // Delete if exists
    try {
        await admin
            .auth()
            .getUserByEmail(email)
            .then((u) => admin.auth().deleteUser(u.uid));
    } catch {}
    // Create user
    const user = await admin.auth().createUser({ email, password, emailVerified: true });
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
    console.log("listing users now:");
    const list = await admin.auth().listUsers();
    console.log(
        "Users in emulator:",
        list.users.map((u) => u.email),
    );
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
    return userCredential.user.getIdToken();
}
