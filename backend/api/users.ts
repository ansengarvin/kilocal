import { Router } from "express";

const router = Router();
import { createUserIfNoneExists, requireAuthentication, syncFirebaseUserWithDB } from "../lib/authentication";
import { getPool, poolPromise } from "../lib/database";

router.post("/", requireAuthentication, async function (req, res) {
    syncFirebaseUserWithDB(req, res);
});

router.post("/login", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();

        console.log("in login");
        const uid = req.user;
        const result = await pool.request().input("id", uid).query("SELECT id FROM users WHERE id = @id");
        console.log("after result");
        if (result.recordset.length) {
            // User ID exists, free to proceed.
            res.status(200).send(result.recordset[0]);
            return;
        } else {
            // User ID doesn't exist, need to perform a sync.
            await syncFirebaseUserWithDB(req, res);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({
            err: err.message,
        });
    }
});

/*
router.delete("/:user_id", requireAuthentication, async function (req, res) {
    try {
        const text = "DELETE FROM users WHERE id = $1";
        const values = [req.params.user_id];
        await pool.query(text, values);
        res.status(204).send();
    } catch (err) {
        res.status(400).send({
            err: err,
        });
    }
});

router.get("/", requireAuthentication, async function (req, res) {
    try {
        const text = "SELECT id, name, email, weight FROM users WHERE id = $1";
        const values = [req.user];
        const result = await pool.query(text, values);
        if (result.rowCount) {
            res.status(200).send(result.rows[0]);
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
*/

module.exports = router;
