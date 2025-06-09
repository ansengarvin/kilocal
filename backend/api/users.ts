import { Router } from "express";

const router = Router();
import { requireAuthentication } from "../lib/authentication";
import { getPool } from "../lib/database";

/**
 * This call exists to treat Firebase as the sole authority on user identification.
 * If an identical email exists to the Firebase email that does not belong to its ID, it is deleted.
 * Afterwards, this call ensures that our database has a column that corresponds with Firebase's auth.
 */
router.post("/sync", requireAuthentication, async function (req, res) {
    try {
        const pool = await getPool();
        const uid = req.user;
        const email = req.email;
        const name = req.body.name;
        const weight = req.body.weight;
        const result = await pool
            .request()
            .input("id", uid)
            .input("email", email)
            .input("name", name)
            .input("weight", weight)
            .query(
                `
                    DELETE FROM users WHERE email = @email AND id <> @id;
                    
                    MERGE INTO users WITH (HOLDLOCK) AS target
                    USING (SELECT @id AS id, @email AS email, @name AS name, @weight AS weight) AS source
                    ON source.id = target.id
                    WHEN MATCHED THEN
                        UPDATE SET email = source.email
                    WHEN NOT MATCHED THEN
                        INSERT (id, email, name, weight)
                        VALUES (source.id, source.email, source.name, source.weight)
                    OUTPUT inserted.id, inserted.name, inserted.email, inserted.weight;
                `,
            );
        res.status(200).send(result.recordset[0]);
        return;
    } catch (err) {
        res.status(500).send({
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

export default router;
