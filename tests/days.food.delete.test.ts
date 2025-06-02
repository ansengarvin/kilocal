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

    test("delete multiple items and flow POST->GET->DELETE", async ({ kcalApiContext }) => {
        // POST
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

        const firstItemID = jsonPost.id;

        // GET
        const response = await kcalApiContext.get(`/days/${today}`);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.totalCalories).toBe(80);
        expect(json.totalCarbs).toBe(20);
        expect(json.totalFat).toBe(20);
        expect(json.totalProtein).toBe(20);
        json.food.forEach((food: any) => {
            expect(food.id).toBeDefined();
            expect(food.name).toBe("Generic");
            expect(food.calories).toBe(80);
            expect(food.amount).toBe(1);
            expect(food.carbs).toBe(20);
            expect(food.fat).toBe(20);
            expect(food.protein).toBe(20);
        });

        // POST second food
        const responseSecondPost = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Banana",
                calories: 100,
                amount: 1,
                carbs: 25,
                fat: 0,
                protein: 1,
            },
        });
        expect(responseSecondPost.status()).toBe(201);
        const jsonSecondPost = await responseSecondPost.json();
        expect(jsonSecondPost.id).toBeDefined();

        const secondItemID = jsonSecondPost.id;

        // GET after second POST
        const responseAfterSecondPost = await kcalApiContext.get(`/days/${today}`);
        expect(responseAfterSecondPost.status()).toBe(200);
        const jsonAfterSecondPost = await responseAfterSecondPost.json();
        expect(jsonAfterSecondPost.totalCalories).toBe(180);
        expect(jsonAfterSecondPost.totalCarbs).toBe(45);
        expect(jsonAfterSecondPost.totalFat).toBe(20);
        expect(jsonAfterSecondPost.totalProtein).toBe(21);
        expect(jsonAfterSecondPost.food).toBeDefined();
        expect(jsonAfterSecondPost.food.length).toBe(2);
        jsonAfterSecondPost.food.forEach((food: any) => {
            expect(food.id).toBeDefined();
            if (food.name === "Generic") {
                expect(food.calories).toBe(80);
                expect(food.amount).toBe(1);
                expect(food.carbs).toBe(20);
                expect(food.fat).toBe(20);
                expect(food.protein).toBe(20);
            } else if (food.name === "Banana") {
                expect(food.calories).toBe(100);
                expect(food.amount).toBe(1);
                expect(food.carbs).toBe(25);
                expect(food.fat).toBe(0);
                expect(food.protein).toBe(1);
            } else {
                throw new Error("Unexpected food name: " + food.name);
            }
        });

        // DELETE first item
        const foodId = jsonPost.id;
        const responseDelete = await kcalApiContext.delete(`/days/${today}/food/${foodId}`);
        expect(responseDelete.status()).toBe(204);

        // GET after DELETE first item
        const responseAfterDeleteFirst = await kcalApiContext.get(`/days/${today}`);
        expect(responseAfterDeleteFirst.status()).toBe(200);
        const jsonAfterDeleteFirst = await responseAfterDeleteFirst.json();
        expect(jsonAfterDeleteFirst.totalCalories).toBe(100);
        expect(jsonAfterDeleteFirst.totalCarbs).toBe(25);
        expect(jsonAfterDeleteFirst.totalFat).toBe(0);
        expect(jsonAfterDeleteFirst.totalProtein).toBe(1);
        expect(jsonAfterDeleteFirst.food).toBeDefined();
        expect(jsonAfterDeleteFirst.food.length).toBe(1);
        jsonAfterDeleteFirst.food.forEach((food: any) => {
            expect(food.id).toBe(secondItemID);
            expect(food.name).toBe("Banana");
            expect(food.calories).toBe(100);
            expect(food.amount).toBe(1);
            expect(food.carbs).toBe(25);
            expect(food.fat).toBe(0);
            expect(food.protein).toBe(1);
        });

        // Attempt to delete first again
        const responseDeleteAgain = await kcalApiContext.delete(`/days/${today}/food/${foodId}`);
        expect(responseDeleteAgain.status()).toBe(404);

        // Delete second
        const responseDeleteSecond = await kcalApiContext.delete(`/days/${today}/food/${secondItemID}`);
        expect(responseDeleteSecond.status()).toBe(204);
        expect(await responseDeleteSecond.text()).toBe("");

        // GET after DELETE second
        const responseAfterDeleteSecond = await kcalApiContext.get(`/days/${today}`);
        expect(responseAfterDeleteSecond.status()).toBe(200);
        const jsonAfterDeleteSecond = await responseAfterDeleteSecond.json();
        expect(jsonAfterDeleteSecond.totalCalories).toBe(0);
        expect(jsonAfterDeleteSecond.totalCarbs).toBe(0);
        expect(jsonAfterDeleteSecond.totalFat).toBe(0);
        expect(jsonAfterDeleteSecond.totalProtein).toBe(0);
        expect(jsonAfterDeleteSecond.food).toBeDefined();
        expect(jsonAfterDeleteSecond.food.length).toBe(0);
        expect(jsonAfterDeleteSecond.food).toEqual([]);
    });
});
