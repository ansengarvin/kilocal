import { expect } from "@playwright/test";
import { createTestWithUser } from "./fixtures/TestUser";

const test = createTestWithUser("days_food_create");
let date = new Date();
const today = date.toISOString().split("T")[0];

test.describe("POST days/:date/food", () => {
    // NOTE: Days are automatically created on POST food for convenience.
    test("all input included (201)", async ({ kcalApiContext }) => {
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

    test("nullable values excluded (201)", async ({ kcalApiContext }) => {
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

    test("calories excluded (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Banana",
            },
        });
        expect(response.status()).toBe(400);
    });

    test("name excluded (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                calories: 80,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("no request body (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {});
        expect(response.status()).toBe(400);
    });

    test("unauthenticated with all valid data (401)", async ({ noAuthApiContext }) => {
        const response = await noAuthApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(401);
    });

    test("negative calories (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Negative Calories",
                calories: -100,
                amount: 1,
                carbs: 0,
                fat: 0,
                protein: 0,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("negative carbs (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Negative Carbs",
                calories: 100,
                amount: 1,
                carbs: -10,
                fat: 0,
                protein: 0,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("negative fat (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Negative Fat",
                calories: 100,
                amount: 1,
                carbs: 0,
                fat: -10,
                protein: 0,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("negative protein (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Negative Protein",
                calories: 100,
                amount: 1,
                carbs: 0,
                fat: 0,
                protein: -10,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("zero amount (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Zero Amount",
                calories: 100,
                amount: 0,
                carbs: 0,
                fat: 0,
                protein: 0,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("negative amount (400)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Negative Amount",
                calories: 100,
                amount: -1,
                carbs: 0,
                fat: 0,
                protein: 0,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("floating point values for calories and macronutrients (201)", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Floating Point Food",
                calories: 80.5,
                amount: 1,
                carbs: 20.2,
                fat: 20.3,
                protein: 20.4,
            },
        });
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.id).toBeDefined();

        // Get day and check that all values are the same
        const responseGet = await kcalApiContext.get(`/days/${today}`);
        expect(responseGet.status()).toBe(200);
        const jsonGet = await responseGet.json();
        expect(jsonGet.food).toBeDefined();
        expect(jsonGet.food.length).toBe(1);
        expect(jsonGet.totalCalories).toBe(80.5);
        expect(jsonGet.totalCarbs).toBe(20.2);
        expect(jsonGet.totalFat).toBe(20.3);
        expect(jsonGet.totalProtein).toBe(20.4);
    });

    test("floating point values for amount", async ({ kcalApiContext }) => {
        //#TODO: Decide if we want to allow floating points for amounts and how we should  handle that.
    });

    test("non-numeric calories", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Non-numeric Calories",
                calories: "eighty",
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("non-numeric carbs", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Non-numeric Carbs",
                calories: 80,
                amount: 1,
                carbs: "twenty",
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("non-numeric fat", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Non-numeric Fat",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: "twenty",
                protein: 20,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("non-numeric protein", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Non-numeric Protein",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: "twenty",
            },
        });
        expect(response.status()).toBe(400);
    });

    test("non-numeric amount", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Non-numeric Amount",
                calories: 80,
                amount: "one",
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("malformed date", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/not-a-date/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("sql injection in date url param", async ({ kcalApiContext }) => {
        const sqlInjectedDate = "2023-10-01' OR 1=1; --";
        const response = await kcalApiContext.post(`/days/${sqlInjectedDate}/food`, {
            data: {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            },
        });
        expect(response.status()).toBe(400);
    });

    test("sql injection in name", async ({ kcalApiContext }) => {
        const response = await kcalApiContext.post(`/days/${today}/food`, {
            data: {
                name: "Generic'; DROP TABLE Days; --",
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

        // Verify both that the food item exists (e.g. the days table still exists)
        const responseGet = await kcalApiContext.get(`/days/${today}`);
        expect(responseGet.status()).toBe(200);
        const jsonGet = await responseGet.json();
        expect(jsonGet.food).toBeDefined();
        expect(jsonGet.food.length).toBe(1);
        expect(jsonGet.food[0].name).toBe("Generic'; DROP TABLE Days; --");
    });

    test("sql injection in numeric fields", async ({ kcalApiContext }) => {
        const numericFields = ["calories", "amount", "carbs", "fat", "protein"];

        for (const field of numericFields) {
            // Use 'of' not 'in'
            const data = {
                name: "Generic",
                calories: 80,
                amount: 1,
                carbs: 20,
                fat: 20,
                protein: 20,
            };
            data[field] = "80; DROP TABLE Days; --";

            const response = await kcalApiContext.post(`/days/${today}/food`, { data });
            expect(response.status()).toBe(400);

            // Verify database integrity
            const responseGet = await kcalApiContext.get(`/days/${today}`);
            expect(responseGet.status()).toBe(200);
        }
    });
});
