import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("days");
let date = new Date();
const today = date.toISOString().split("T")[0];

test.describe("GET /days/", () => {
    test("explicitly create a day then get it (200)", async ({ kcalApiContext }) => {
        // Create a new day
        const responsePost = await kcalApiContext.post(`/days/`, {
            data: {
                date: today,
            },
        });
        expect(responsePost.status()).toBe(201);
        // Get day and check if empty
        const responseGet = await kcalApiContext.get(`/days/${today}`);
        expect(responseGet.status()).toBe(200);
        const jsonGet = await responseGet.json();
        expect(jsonGet.totalCalories).toBe(0);
        expect(jsonGet.totalCarbs).toBe(0);
        expect(jsonGet.totalFat).toBe(0);
        expect(jsonGet.totalProtein).toBe(0);
        expect(jsonGet.food).toBeDefined();
        expect(jsonGet.food.length).toBe(0);
    });

    // NOTE: Days are automatically created on GET for convenience.
    test("automatically create new empty day on GET (200)", async ({ kcalApiContext }) => {
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

    test("malformed date", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.get(`/days/not-a-date`);
        expect(response.status()).toBe(400);
    });

    test("get day with food with single item", async ({ kcalApiContext }) => {
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

        // Get the day and check if it contains the food item
        const responseGet = await kcalApiContext.get(`/days/${today}`);
        expect(responseGet.status()).toBe(200);
        const jsonGet = await responseGet.json();
        expect(jsonGet.totalCalories).toBe(80);
        expect(jsonGet.totalCarbs).toBe(20);
        expect(jsonGet.totalFat).toBe(20);
        expect(jsonGet.totalProtein).toBe(20);
        expect(jsonGet.food.length).toBe(1);
        expect(jsonGet.food[0].id).toBe(jsonPost.id);
        expect(jsonGet.food[0].name).toBe("Generic");
        expect(jsonGet.food[0].calories).toBe(80);
        expect(jsonGet.food[0].amount).toBe(1);
        expect(jsonGet.food[0].carbs).toBe(20);
        expect(jsonGet.food[0].fat).toBe(20);
        expect(jsonGet.food[0].protein).toBe(20);
    });

    test("validate correct summation", async ({ kcalApiContext }) => {
        const foodItems = [
            {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
            {
                name: "Banana",
                calories: 100,
                amount: 1,
                carbs: 25,
                fat: 0,
                protein: 1,
            },
            {
                name: "Apple",
                calories: 95,
                amount: 1,
                carbs: 25,
                fat: 0,
                protein: 1,
            },
            {
                name: "Chicken Breast",
                calories: 165,
                amount: 1,
                carbs: 0,
                fat: 3.6,
                protein: 31,
            },
            {
                name: "Rice",
                calories: 130,
                amount: 1,
                carbs: 28,
                fat: 0.3,
                protein: 2.7,
            },
        ];

        // Post the food items to the day
        let totalCalories = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalProtein = 0;
        for (const item of foodItems) {
            totalCalories += item.calories * item.amount;
            totalCarbs += item.carbs * item.amount;
            totalFat += item.fat * item.amount;
            totalProtein += item.protein * item.amount;
            const response = await kcalApiContext.post(`/days/${today}/food`, {
                data: item,
            });
            expect(response.status()).toBe(201);
        }
        // Get the day and check if totals are correct
        const responseGet = await kcalApiContext.get(`/days/${today}`);
        expect(responseGet.status()).toBe(200);
        const jsonGet = await responseGet.json();
        expect(jsonGet.totalCalories).toBe(totalCalories);
        expect(jsonGet.totalCarbs).toBe(totalCarbs);
        expect(jsonGet.totalFat).toBe(totalFat);
        expect(jsonGet.totalProtein).toBe(totalProtein);
    });

    test("unauthenticated (401)", async ({ noAuthApiContext }) => {
        const response = await noAuthApiContext.get(`/days/${today}`);
        expect(response.status()).toBe(401);
    });

    test("SQL Injection (400)", async ({ kcalApiContext }) => {
        const sqlInjectedDate = "2023-10-01' OR 1=1; --";
        const response = await kcalApiContext.get(`/days/${sqlInjectedDate}`);
        expect(response.status()).toBe(400);
    });
});
