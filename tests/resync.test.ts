import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("resync");

test("database sync", async ({ user, kcalApiContext }) => {
    const response = await kcalApiContext.post("/users/sync");
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.id).toBeDefined();
    expect(json.id).toBe(user.uid);
    expect(json.email).toBe(user.email);
    expect(json.name).toBeDefined();
    expect(json.weight).toBeDefined();
});
