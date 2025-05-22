import { Router } from "express";
import { requireAuthentication } from "../lib/authentication";
import { getPool, poolPromise } from "../lib/database";
import { RequestError } from "mssql";

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
        }
    } catch (err) {
        console.log("error in days:", err);
        res.status(500).send({
            error: err,
        });
    }
});

// Add a food to a day
router.post("/:date/food", requireAuthentication, async function (req, res) {
    try {
        if (!req.body || req.body.calories === null) {
            res.status(400).send({ err: "entry must have request body with calories" });
            return;
        }

        const pool = await getPool();
        let day_id = await get_day_id(req.user, req.params.date);

        const insertResult = await pool
            .request()
            .input("day_id", day_id)
            .input("name", req.body.name)
            .input("calories", req.body.calories)
            .input("amount", req.body.amount || 1)
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
    } catch (err) {
        if (err instanceof RequestError) {
            console.log("RequestError:", err);
            res.status(400).send({
                err: err.message,
            });
            return;
        } else {
            res.status(500).send({ err: "Internal server error" });
        }
    }
});

// Gets the contents of a day
router.get("/:date", requireAuthentication, async function (req, res) {
    try {
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
    } catch (err) {
        console.log("DATE get error:", err);
        res.status(500).send({
            err: err,
        });
    }
});

router.delete("/:date/food/:food_id", requireAuthentication, async function (req, res) {
    try {
        let day_id = await get_day_id(req.user, req.params.date);
        const pool = await getPool();

        const result = await pool.request().input("food_id", req.params.food_id).input("day_id", day_id).query(`
                DELETE FROM foods
                WHERE id = @food_id AND day_id = @day_id
            `);

        // result.rowsAffected[0] contains the number of rows deleted
        if (result.rowsAffected[0] === 0) {
            res.status(404).send({
                err: "Food not found",
            });
        } else {
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).send({
            err: err,
        });
    }
});

module.exports = router;
