import { APIRequestContext, test as base, TestType } from "@playwright/test";
import playwright from "playwright";
import { TestUser } from "./TestUser";

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
