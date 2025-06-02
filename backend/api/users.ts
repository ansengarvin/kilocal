import { Router } from "express";

const router = Router();
import { requireAuthentication, syncFirebaseUserWithDB } from "../lib/authentication";
import { getPool } from "../lib/database";

router.post("/", requireAuthentication, async function (req, res) {
    syncFirebaseUserWithDB(req, res);
});

/**
 * This call checks if the provided firebase UID exists as a user in the Kcal database,
 * and creates a new table in the database if they do. If the provided email already exists in the database,
 * that account is deleted and replaced with the new UID.
 *
 * This is done because Firebase Auth is treated as the sole authority on a users' vailidity.
 */
router.post("/sync", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();
        const uid = req.user;
        const result = await pool
            .request()
            .input("id", uid)
            .query("SELECT id, name, email, weight FROM users WHERE id = @id");
        if (result.recordset.length) {
            // User ID exists, free to proceed.
            res.status(200).send(result.recordset[0]);
            return;
        } else {
            // User ID doesn't exist, need to perform a sync.
            await syncFirebaseUserWithDB(req, res);
        }
    } catch (err) {
        res.status(400).send({
            err: err.message,
        });
        return;
    }
});

router.delete("/:user_id", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();
        const userId = req.params.user_id;
        const result = await pool.request().input("id", userId).query("DELETE FROM users WHERE id = @id");
        if (result.rowsAffected[0] > 0) {
            res.status(204).send();
            return;
        } else {
            res.status(404).send({ err: "User not found" });
            return;
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            err: err.message,
        });
        return;
    }
});

router.get("/", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();
        const uid = req.user;
        const result = await pool
            .request()
            .input("id", uid)
            .query("SELECT id, name, email, weight FROM users WHERE id = @id");
        if (result.recordset.length) {
            res.status(200).send(result.recordset[0]);
            return;
        } else {
            res.status(404).send({
                err: "User not found",
            });
            return;
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            err: err.message,
        });
        return;
    }
});

module.exports = router;
