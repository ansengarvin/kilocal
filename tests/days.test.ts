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

    test("POST /days/ - malformed date", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post("/days/", {
            data: {
                date: "not-a-date",
            },
        });
        expect(response.status()).toBe(400);
    });

    test("POST days/:date/food - all valid inputs", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.id).toBeDefined();
    });

    test("GET /days/ empty day", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.get(`/days/${today}`);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.totalCalories).toBe(0);
        expect(json.totalCarbs).toBe(0);
        expect(json.totalFat).toBe(0);
        expect(json.totalProtein).toBe(0);
        expect(json.food).toBeDefined();
        expect(json.food.length).toBe(0);
    });

    test("POST days/:date/food - nullable values excluded", async ({ kcalApiContext }) => {
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

    test("POST days/:date/food - calories excluded", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Banana",
            },
        });
        expect(response.status()).toBe(400);
    });

    test("POST days/:date/food - name excluded", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                calories: 80,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("POST days/:date/food - no request body", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {});
        expect(response.status()).toBe(400);
    });

    test("DELETE nonexistant item", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.delete(`/days/${today}/food/999999`);
        expect(response.status()).toBe(404);
    });

    test("/days/ POST->GET->DELETE flow", async ({ kcalApiContext }) => {
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
