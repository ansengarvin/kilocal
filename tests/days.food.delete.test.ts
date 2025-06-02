import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("days_food_delete");
let date = new Date();
const today = date.toISOString().split("T")[0];

test.describe("DELETE /days/:date/food/:food_id", () => {
    test("single item", async ({ kcalApiContext }) => {
        // Create a food item
        const responsePost = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(responsePost.status()).toBe(201);
        const jsonPost = await responsePost.json();
        expect(jsonPost.id).toBeDefined();

        // Delete the food item
        const responseDelete = await kcalApiContext.delete(`/days/${today}/food/${jsonPost.id}`);
        expect(responseDelete.status()).toBe(204);
        expect(await responseDelete.text()).toBe("");

        // Verify the item is deleted
        const responseGet = await kcalApiContext.get(`/days/${today}`);
        expect(responseGet.status()).toBe(200);
        const jsonGet = await responseGet.json();
        expect(jsonGet.totalCalories).toBe(0);
        expect(jsonGet.totalCarbs).toBe(0);
        expect(jsonGet.totalFat).toBe(0);
        expect(jsonGet.totalProtein).toBe(0);
        expect(jsonGet.food).toEqual([]);
    });

    test("nonexistant item", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.delete(`/days/${today}/food/999999`);
        expect(response.status()).toBe(404);
    });

    test("malformed food id", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.delete(`/days/${today}/food/not-a-number`);
        expect(response.status()).toBe(400);
    });

    test("malformed date", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.delete(`/days/not-a-date/food/1`);
        expect(response.status()).toBe(400);
    });

    test("unauthenticated api call delete item that exists (401)", async ({ kcalApiContext, noAuthApiContext }) => {
        // Create a food item with the correct user
        const responsePost = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(responsePost.status()).toBe(201);
        const jsonPost = await responsePost.json();
        expect(jsonPost.id).toBeDefined();

        // Attempt to delete it with the wrong user
        const responseDelete = await noAuthApiContext.delete(`/days/${today}/food/${jsonPost.id}`);
        expect(responseDelete.status()).toBe(401);
    });

    test("wrong user deleting another user's item (404)", async ({ kcalApiContext, wrongUserAPIContext }) => {
        // Create a food item with the correct user
        const responsePost = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(responsePost.status()).toBe(201);
        const jsonPost = await responsePost.json();
        expect(jsonPost.id).toBeDefined();

        // Attempt to delete it with the wrong user
        const responseDelete = await wrongUserAPIContext.delete(`/days/${today}/food/${jsonPost.id}`);
        // return 404 so we don't reveal that the item id actually exists
        expect(responseDelete.status()).toBe(404);
    });

    test("delete same item twice in a row (404)", async ({ kcalApiContext }) => {
        // Create a food item
        const responsePost = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(responsePost.status()).toBe(201);
        const jsonPost = await responsePost.json();
        expect(jsonPost.id).toBeDefined();

        // Delete the food item
        const responseDelete = await kcalApiContext.delete(`/days/${today}/food/${jsonPost.id}`);
        expect(responseDelete.status()).toBe(204);
        expect(await responseDelete.text()).toBe("");

        // Attempt to delete the same item again
        const responseDeleteAgain = await kcalApiContext.delete(`/days/${today}/food/${jsonPost.id}`);
        expect(responseDeleteAgain.status()).toBe(404);
    });

    test("sql injection in date", async ({ kcalApiContext }) => {
        const sqlInjectionString = "2023-10-01; DROP TABLE food; --";
        const response = await kcalApiContext.delete(`/days/${sqlInjectionString}/food/1`);
        expect(response.status()).toBe(400);
        // Check if food table still exists
        const responseCheck = await kcalApiContext.get(`/days/${today}`);
        expect(responseCheck.status()).toBe(200);
    });

    test("sql injection in food id", async ({ kcalApiContext }) => {
        const sqlInjectionString = "Generic'; DROP TABLE food; --";
        const response = await kcalApiContext.delete(`/days/${today}/food/${sqlInjectionString}`);
        expect(response.status()).toBe(400);
        // Check if food table still exists
        const responseCheck = await kcalApiContext.get(`/days/${today}`);
        expect(responseCheck.status()).toBe(200);
    });
});
