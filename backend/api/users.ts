import { Router } from "express";

const router = Router();
import { createUserIfNoneExists, requireAuthentication, syncFirebaseUserWithDB } from "../lib/authentication";
import { getPool, poolPromise } from "../lib/database";

router.post("/", requireAuthentication, async function (req, res) {
    syncFirebaseUserWithDB(req, res);
});

/**
 * This API call is a misnomer; what it really is is a firebase-database sync.
 * It checks if a user exists, and if they don't, create a user with the firebase UID.
 * # TODO: Consolidate this process of function calls into a single SQL query
 */
router.post("/login", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();
        const uid = req.user;
        const result = await pool.request().input("id", uid).query("SELECT id FROM users WHERE id = @id");
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
    }
});

router.delete("/:user_id", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();
        const userId = req.params.user_id;
        const result = await pool.request().input("id", userId).query("DELETE FROM users WHERE id = @id");
        if (result.rowsAffected[0] > 0) {
            res.status(204).send();
        } else {
            res.status(404).send({ err: "User not found" });
        }
    } catch (err) {
        res.status(400).send({
            err: err.message,
        });
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
        } else {
            res.status(404).send({
                err: "User not found",
            });
        }
    } catch (err) {
        res.status(400).send({
            err: err.message,
        });
    }
});

module.exports = router;
