import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("days_create");
let date = new Date();
const today = date.toISOString().split("T")[0];

test.describe("POST /days/", () => {
    test("create a day with a valid date (201)", async ({ user, kcalApiContext }) => {
        const response = await kcalApiContext.post("/days/", {
            data: {
                date: today,
            },
        });
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.id).toBeDefined();
        expect(json.user_id).toBe(user.uid);
        expect(json.date).toBe(today);
    });

    test("Create same day twice (400)", async ({ kcalApiContext }) => {
        // First create
        const responseFirst = await kcalApiContext.post("/days/", {
            data: {
                date: today,
            },
        });
        expect(responseFirst.status()).toBe(201);

        // Second create should fail with 400
        const responseSecond = await kcalApiContext.post("/days/", {
            data: {
                date: today,
            },
        });
        expect(responseSecond.status()).toBe(400);
    });

    test("malformed date (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post("/days/", {
            data: {
                date: "not-a-date",
            },
        });
        expect(response.status()).toBe(400);
    });

    test("no request body (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post("/days/", {});
        expect(response.status()).toBe(400);
    });

    test("unauthenticated (401)", async ({ noAuthApiContext }) => {
        const response = await noAuthApiContext.post("/days/", {
            data: {
                date: today,
            },
        });
        expect(response.status()).toBe(401);
    });
});
