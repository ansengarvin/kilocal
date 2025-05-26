import { test as base, APIRequestContext, TestType } from "@playwright/test";
import { createFirebaseTestUser, deleteFirebaseTestUser, getUserIdToken } from "./firebaseSetup";
import playwright from "playwright";

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
        if (response.status() !== 201) {
            throw new Error(`Failed to create user: Status ${response.status()}`);
        }
    }

    async cleanup() {
        await deleteFirebaseTestUser(this.email);
    }
}

// Loosely follows https://playwright.dev/docs/test-fixtures
export function createTestWithUser(
    testName: string,
): TestType<{ user: TestUser; kcalApiContext: APIRequestContext }, {}> {
    return base.extend<{ user: TestUser; kcalApiContext: APIRequestContext }>({
        user: async ({}, use) => {
            const email = testName + "@ansengarvin.com";
            const user = new TestUser(email, "BigTest1111!!!!");
            await user.createFirebaseUser();
            await user.getFirebaseToken();
            await use(user);
            await user.cleanup();
        },
        kcalApiContext: async ({ user }, use) => {
            const kcalApiContext = await playwright.request.newContext({
                baseURL: "http://localhost:8000/",
                extraHTTPHeaders: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            await user.syncDatabase(kcalApiContext);
            await use(kcalApiContext);
            await kcalApiContext.dispose();
        },
    });
}
