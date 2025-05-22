import { APIRequest, APIRequestContext, test as base, TestType } from "@playwright/test";
import { TestUser } from "./TestUser";

export function createTestWithUser(
    email: string,
    password: string,
): TestType<{ user: TestUser; kcalApiContext: APIRequestContext; apiRequest: APIRequest }, {}> {
    return base.extend<{ user: TestUser; kcalApiContext: APIRequestContext; apiRequest: APIRequest }>({
        user: async ({}, use) => {
            const user = new TestUser(email, password);
            await user.createFirebaseUser();
            await user.getFirebaseToken();
            await use(user);
            await user.cleanup();
        },
        kcalApiContext: async ({ user, apiRequest }, use) => {
            const kcalApiContext = await apiRequest.newContext({
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
