import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("days");
let date = new Date();
// set date to doay in "yyyy-mm-dd" format
const today = date.toISOString().split("T")[0];
console.log(today);

test("POST /days/", async ({ user, kcalApiContext }) => {
    const response = await kcalApiContext.post("/days/", {
        data: {
            date: "2025-10-01",
        },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();
    expect(json.id).toBeDefined();
    expect(json.user_id).toBe(user.uid);
    expect(json.date).toBe("2025-10-01");
});
