import admin from "firebase-admin";

// #TODO: Right now, there's a big gap in testing the user onboarding process.
// See https://github.com/ansengarvin/kilocal/issues/36 for a larger discussion.

admin.initializeApp({
    credential: admin.credential.cert("../backend/etc/keys/service.json"),
});

export async function createVerifiedTestUser(email: string, password: string) {
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

export async function deleteVerifiedTestUser(email: string) {
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
