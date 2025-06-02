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
        const response = await kcalApiContext.post("/users/sync");
        const status = response.status();
        const message = await response.text();
        const err = `Failed to create user: Status ${status}, message: ${message}`;
        if (response.status() !== 201) {
            console.error(err);
            throw new Error(err);
        }
    }

    async cleanup() {
        await deleteFirebaseTestUser(this.email);
    }
}

// Loosely follows https://playwright.dev/docs/test-fixtures
export function createTestWithUser(testName: string): TestType<
    {
        user: TestUser;
        wrongUser: TestUser;
        kcalApiContext: APIRequestContext;
        wrongUserAPIContext: APIRequestContext;
        noAuthApiContext: APIRequestContext;
    },
    {}
> {
    return base.extend<{
        user: TestUser;
        wrongUser: TestUser;
        kcalApiContext: APIRequestContext;
        wrongUserAPIContext: APIRequestContext;
        noAuthApiContext: APIRequestContext;
    }>({
        user: async ({}, use) => {
            const email = testName + "@ansengarvin.com";
            const user = new TestUser(email, "BigTest1111!!!!");
            await user.createFirebaseUser();
            await user.getFirebaseToken();
            await use(user);
            await user.cleanup();
        },
        wrongUser: async ({}, use) => {
            const email = testName + "wrongUser@ansengarvin.com";
            const wrongUser = new TestUser(email, "BigTest1111!!!!");
            await wrongUser.createFirebaseUser();
            await wrongUser.getFirebaseToken();
            await use(wrongUser);
            await wrongUser.cleanup();
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
        wrongUserAPIContext: async ({ wrongUser }, use) => {
            const wrongUserAPIContext = await playwright.request.newContext({
                baseURL: "http://localhost:8000/",
                extraHTTPHeaders: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${wrongUser.token}`,
                },
            });
            await use(wrongUserAPIContext);
            await wrongUserAPIContext.dispose();
        },
        noAuthApiContext: async ({}, use) => {
            const noAuthApiContext = await playwright.request.newContext({
                baseURL: "http://localhost:8000/",
                extraHTTPHeaders: {
                    "Content-Type": "application/json",
                },
            });
            await use(noAuthApiContext);
            await noAuthApiContext.dispose();
        },
    });
}
