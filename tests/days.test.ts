import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("days");
let date = new Date();
const today = date.toISOString().split("T")[0];

test.describe("Days API", () => {
    test("POST /days/", async ({ user, kcalApiContext }) => {
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

    test("POST days/:date/food - all valid inputs", async ({ kcalApiContext }) => {
        console.log(`/${today}/food`);
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Banana",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 0,
                protein: 1,
            },
        });
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.id).toBeDefined();
    });

    test("POST days/:date/food - nullable values excluded", async ({ kcalApiContext }) => {
        console.log(`/${today}/food`);
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Banana",
                calories: 80,
            },
        });
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.id).toBeDefined();
    });
});
