import { Router } from "express";
import { requireAuthentication } from "../lib/authentication";
import { getPool } from "../lib/database";
import { RequestError } from "mssql";
import { isDate, isNumericID } from "../lib/utils";

const router = Router();

// Gets a day ID if the day entry exists.
// If the day entry does not exist, creates then returns ID.
//TODO: Using multiple SQL queries is probably not the way to do this - You can probably do it with a single SQL query.
async function get_day_id(user_id: string, date: String) {
    // SELECT
    const pool = await getPool();
    let result = await pool
        .request()
        .input("user_id", user_id)
        .input("date", date)
        .query("SELECT id FROM days WHERE user_id = @user_id AND date = @date");

    if (result.recordset.length !== 0) {
        return result.recordset[0].id;
    } else {
        // INSERT
        let insertResult = await pool
            .request()
            .input("user_id", user_id)
            .input("date", date)
            .query("INSERT INTO days(user_id, date) OUTPUT INSERTED.id VALUES(@user_id, @date)");
        return insertResult.recordset[0].id;
    }
}

// Make a new day
router.post("/", requireAuthentication, async function (req, res) {
    try {
        // Ensure user_id and date provided
        if (!req.body || !req.body.date) {
            res.status(400).send({ err: "Missing date in request body" });
            return;
        }

        // Check if the date is properly formatted
        if (!isDate(req.body.date)) {
            res.status(400).send({ err: "Date must be in YYYY-MM-DD format" });
            return;
        }

        const pool = await getPool();

        // Check if the date already exists for this user
        const checkResult = await pool
            .request()
            .input("user_id", req.user)
            .input("date", req.body.date)
            .query("SELECT id FROM days WHERE user_id = @user_id AND date = @date");

        if (checkResult.recordset.length !== 0) {
            // Date already exists.
            res.status(400).send({ err: "Date already exists for user" });
            return;
        } else {
            // Adds the day into the database and returns the new row
            const insertResult = await pool
                .request()
                .input("user_id", req.user)
                .input("date", req.body.date)
                .query(
                    "INSERT INTO days(user_id, date) OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.date VALUES(@user_id, @date)",
                );

            const row = insertResult.recordset[0];
            res.status(201).send({
                id: row.id,
                user_id: row.user_id,
                date: row.date.toISOString().split("T")[0], // split date or it will be in format yyyy-mm-ddT00:00:00
            });
            return;
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            error: err,
        });
        return;
    }
});

// Add a food to a day
router.post("/:date/food", requireAuthentication, async function (req, res) {
    try {
        if (!req.body || req.body.calories == null || req.body.name == null) {
            res.status(400).send({ err: "entry must have request body with calories" });
            return;
        }

        if (!isDate(req.params.date)) {
            res.status(400).send({ err: "Date must be in YYYY-MM-DD format" });
            return;
        }

        if (req.body.calories < 0) {
            res.status(400).send({ err: "Calories must be a positive number" });
            return;
        }
        if (req.body.carbs && req.body.carbs < 0) {
            res.status(400).send({ err: "Carbs must be a positive number" });
            return;
        }
        if (req.body.fat && req.body.fat < 0) {
            res.status(400).send({ err: "Fat must be a positive number" });
            return;
        }
        if (req.body.protein && req.body.protein < 0) {
            res.status(400).send({ err: "Protein must be a positive number" });
            return;
        }
        if (req.body.amount !== undefined && req.body.amount < 1) {
            res.status(400).send({ err: "Amount must be a positive number" });
            return;
        }

        const pool = await getPool();
        let day_id = await get_day_id(req.user, req.params.date);

        const insertResult = await pool
            .request()
            .input("day_id", day_id)
            .input("name", req.body.name)
            .input("calories", req.body.calories)
            .input("amount", req.body.amount !== undefined ? req.body.amount : 1)
            .input("carbs", req.body.carbs || 0)
            .input("fat", req.body.fat || 0)
            .input("protein", req.body.protein || 0)
            .input("position", 0) // TODO: Calculate position instead of 0
            .query(`
                INSERT INTO Foods(day_id, name, calories, amount, carbs, fat, protein, position)
                OUTPUT INSERTED.id
                VALUES(@day_id, @name, @calories, @amount, @carbs, @fat, @protein, @position)
            `);

        res.status(201).send({
            id: insertResult.recordset[0].id,
        });
        return;
    } catch (err) {
        if (err instanceof RequestError) {
            console.error("RequestError:", err);
            res.status(400).send({
                err: err.message,
            });
            return;
        } else {
            console.error("Error:", err);
            res.status(500).send({ err: "Internal server error" });
            return;
        }
    }
});

// Gets the contents of a day
router.get("/:date", requireAuthentication, async function (req, res) {
    try {
        if (!isDate(req.params.date)) {
            res.status(400).send({ err: "Date must be in YYYY-MM-DD format" });
            return;
        }

        let day_id = await get_day_id(req.user, req.params.date);

        const pool = await getPool();
        const result = await pool
            .request()
            .input("day_id", day_id)
            .query("SELECT id, name, calories, amount, carbs, fat, protein FROM foods WHERE day_id = @day_id");

        // Calculate totals
        let totalCalories = 0,
            totalCarbs = 0,
            totalProtein = 0,
            totalFat = 0;
        for (let i = 0; i < result.recordset.length; i++) {
            totalCalories += result.recordset[i].calories * result.recordset[i].amount;
            totalCarbs += result.recordset[i].carbs * result.recordset[i].amount;
            totalProtein += result.recordset[i].protein * result.recordset[i].amount;
            totalFat += result.recordset[i].fat * result.recordset[i].amount;
        }

        res.status(200).send({
            totalCalories: totalCalories,
            totalCarbs: totalCarbs,
            totalProtein: totalProtein,
            totalFat: totalFat,
            food: result.recordset,
        });
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            err: err,
        });
        return;
    }
});

router.delete("/:date/food/:food_id", requireAuthentication, async function (req, res) {
    try {
        if (!isDate(req.params.date)) {
            res.status(400).send({ err: "Date must be in YYYY-MM-DD format" });
            return;
        }

        if (!isNumericID(req.params.food_id)) {
            res.status(400).send({ err: "Food ID must be a numeric value" });
            return;
        }

        console.log("Attempting to get day id");
        let day_id = await get_day_id(req.user, req.params.date);
        const pool = await getPool();

        console.log(
            "Attempting to delete now by user",
            req.user,
            "with food_id",
            req.params.food_id,
            "and day_id",
            day_id,
        );
        const result = await pool.request().input("food_id", req.params.food_id).input("day_id", day_id).query(`
                DELETE FROM foods
                WHERE id = @food_id AND day_id = @day_id
            `);
        console.log("Result of delete:", result);

        // result.rowsAffected[0] contains the number of rows deleted
        if (result.rowsAffected[0] === 0) {
            res.status(404).send({
                err: "Food not found",
            });
            return;
        } else {
            res.status(204).send();
            return;
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            err: err,
        });
        return;
    }
});

module.exports = router;
