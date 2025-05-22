import admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// #TODO: Right now, there's a big gap in testing the user onboarding process.
// See https://github.com/ansengarvin/kilocal/issues/36 for a larger discussion.

admin.initializeApp({
    credential: admin.credential.cert("./backend/etc/keys/service.json"),
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

const firebaseClientConfid = {
    apiKey: "AIzaSyD0sR_vCnUWa1ZkuhvyTCwYD6P70e3qGFA",
    authDomain: "ag-kilocal.firebaseapp.com",
    projectId: "ag-kilocal",
    storageBucket: "ag-kilocal.appspot.com",
    messagingSenderId: "542755219829",
    appId: "1:542755219829:web:0ed08fda06e70519becb3c",
    measurementId: "G-7XYMCE191N",
};

let clientAppInitialized = false;

export async function getUserIdToken(email: string, password: string): Promise<string> {
    if (!clientAppInitialized) {
        initializeClientApp(firebaseClientConfid);
        clientAppInitialized = true;
    }
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.getIdToken();
}
