import { Router } from "express";
import { requireAuthentication } from "../lib/authentication";
import { getPool } from "../lib/database";
import { isDate, isNumber, isNumericID } from "../lib/utils";
import { requireBody, requireDayID, requireValidDateParam } from "../lib/middleware";

const router = Router();

// Make a new day
router.post("/", requireAuthentication, requireBody, async function (req, res) {
    try {
        // Ensure user_id and date provided
        if (!req.body || !req.body.date) {
            res.status(400).send({ err: "Missing date in request body" });
            return;
        }

        // Check if the date is properly formatted
        if (!isDate(req.body.date)) {
            res.status(400).send({ err: `Date must be in YYYY-MM-DD format. Your date is ${req.body.date}` });
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
router.post(
    "/:date/food",
    requireAuthentication,
    requireBody,
    requireValidDateParam,
    requireDayID,
    async function (req, res) {
        try {
            if (req.body.calories == null || req.body.name == null) {
                res.status(400).send({ err: "entry must have request body with calories" });
                return;
            }

            if (!isNumber(req.body.calories) || req.body.calories < 0) {
                res.status(400).send({ err: "Calories must be a positive number" });
                return;
            }
            if (req.body.carbs && (!isNumber(req.body.carbs) || req.body.carbs < 0)) {
                res.status(400).send({ err: "Carbs must be a positive number" });
                return;
            }
            if (req.body.fat && (!isNumber(req.body.fat) || req.body.fat < 0)) {
                res.status(400).send({ err: "Fat must be a positive number" });
                return;
            }
            if (req.body.protein && (!isNumber(req.body.protein) || req.body.protein < 0)) {
                res.status(400).send({ err: "Protein must be a positive number" });
                return;
            }
            if (req.body.amount !== undefined && (!isNumber(req.body.amount) || req.body.amount < 1)) {
                res.status(400).send({ err: "Amount must be a positive number" });
                return;
            }

            const pool = await getPool();
            const insertResult = await pool
                .request()
                .input("day_id", req.dayID)
                .input("name", req.body.name)
                .input("calories", req.body.calories)
                .input("amount", req.body.amount !== undefined ? req.body.amount : 1)
                .input("carbs", req.body.carbs || 0)
                .input("fat", req.body.fat || 0)
                .input("protein", req.body.protein || 0)
                .input("position", 0) // TODO: Calculate position instead of 0
                .query(`
                    INSERT INTO Foods(day_id, name, calories, amount, carbs, fat, protein, position)
                    OUTPUT INSERTED.id, INSERTED.name, INSERTED.calories, INSERTED.amount, INSERTED.carbs, INSERTED.fat, INSERTED.protein
                    VALUES(@day_id, @name, @calories, @amount, @carbs, @fat, @protein, @position)
                `);

            const row = insertResult.recordset[0];
            res.status(201).send({
                id: row.id,
                name: row.name,
                calories: row.calories,
                amount: row.amount,
                carbs: row.carbs,
                fat: row.fat,
                protein: row.protein,
            });
            return;
        } catch (err) {
            console.error("Error:", err);
            res.status(500).send({ err: "Internal server error" });
            return;
        }
    },
);

// Gets the contents of a day
router.get("/:date", requireAuthentication, requireValidDateParam, requireDayID, async function (req, res) {
    try {
        const pool = await getPool();
        const result = await pool
            .request()
            .input("day_id", req.dayID)
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

router.delete(
    "/:date/food/:food_id",
    requireAuthentication,
    requireValidDateParam,
    requireDayID,
    async function (req, res) {
        try {
            if (!isNumericID(req.params.food_id)) {
                res.status(400).send({ err: "Food ID must be a numeric value" });
                return;
            }

            const pool = await getPool();

            const result = await pool.request().input("food_id", req.params.food_id).input("day_id", req.dayID).query(`
                DELETE FROM foods
                WHERE id = @food_id AND day_id = @day_id
            `);

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
    },
);

module.exports = router;
