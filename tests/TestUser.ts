import { test as base, APIRequestContext } from "@playwright/test";
import { createVerifiedTestUser, deleteVerifiedTestUser, getUserIdToken } from "./setup";

export class TestUser {
    public email: string;
    public password: string;
    public uid: string | null;
    public token: null;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
        this.uid = null;
        this.token = null;
    }

    async createFirebaseUser() {
        await createVerifiedTestUser(this.email, this.password);
    }

    async getFirebaseToken(): Promise<string> {
        return getUserIdToken(this.email, this.password);
    }

    async syncDatabase(kcalApiContext: APIRequestContext) {
        const response = await kcalApiContext.post("/users/login");
        if (response.status() !== 201) {
            throw new Error("Failed to create user");
        }
    }

    async cleanup() {
        await deleteVerifiedTestUser(this.email);
    }
}
