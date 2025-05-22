import { test as base, APIRequestContext } from "@playwright/test";
import { createFirebaseTestUser, deleteFirebaseTestUser, getUserIdToken } from "./setup";

export class TestUser {
    public email: string;
    public password: string;
    public uid: string | null;
    public token: string | null;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
        this.uid = null;
        this.token = null;
    }

    async createFirebaseUser() {
        const userInfo = await createFirebaseTestUser(this.email, this.password);
        this.uid = userInfo.uid;
    }

    async getFirebaseToken() {
        this.token = await getUserIdToken(this.email, this.password);
    }

    async syncDatabase(kcalApiContext: APIRequestContext) {
        const response = await kcalApiContext.post("/users/login");
        console.log(response.status());
        if (response.status() !== 200) {
            throw new Error(`Failed to create user: Status ${response.status()}`);
        }
    }

    async cleanup() {
        await deleteFirebaseTestUser(this.email);
    }
}
