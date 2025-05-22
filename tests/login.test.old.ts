import { test, expect, APIRequestContext } from "@playwright/test";
import { createVerifiedTestUser, deleteVerifiedTestUser, getUserIdToken } from "./setup";

let firebaseApiContext: APIRequestContext;
let kcalApiContext: APIRequestContext;
let uid: string | null = null;
let email: string = "test@ansengarvin.com";
let password: string = "bigTest1111!!";
test.beforeAll(async ({ playwright }) => {
    const user = await createVerifiedTestUser(email, password);
    uid = user.uid;
    const token = await getUserIdToken(email, password);
    firebaseApiContext = await playwright.request.newContext({
        baseURL:
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD0sR_vCnUWa1ZkuhvyTCwYD6P70e3qGFA",
    });
    kcalApiContext = await playwright.request.newContext({
        baseURL: "http://localhost:8000/",
        extraHTTPHeaders: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
});

test("basic test", async ({}) => {
    const response = await kcalApiContext.get("/test");
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.time).toBeDefined();
});

test("database sync", async ({}) => {
    const response = await kcalApiContext.post("/users/login");
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.id).toBeDefined();
    expect(json.id).toBe(uid);
});

test.afterAll(async () => {
    await deleteVerifiedTestUser(email);
    await firebaseApiContext.dispose();
    await kcalApiContext.dispose();
});
