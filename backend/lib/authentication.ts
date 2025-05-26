import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { getPool } from "./database";

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log("Firebase emulator activated at", process.env.FIREBASE_AUTH_EMULATOR_HOST);
    admin.initializeApp({
        projectId: "ag-kilocal",
    });
} else {
    console.log("Using production firebase server");
    admin.initializeApp({
        credential: admin.credential.cert("./etc/keys/service.json"),
    });
}

export function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization") || "";

    if (!authHeader) {
        req.user = "";
        res.status(401).send({
            err: "no authorization header",
        });
    } else {
        const token = authHeader.split("Bearer ")[1];

        if (!token) {
            req.user = "";
            res.status(401).send({
                err: "missing auth token",
            });
        } else {
            admin
                .auth()
                .verifyIdToken(token)
                .then((user) => {
                    req.user = user.uid;
                    req.email = user.email;
                    next();
                })
                .catch((err) => {
                    if (err.code === "ENOTFOUND") {
                        res.status(503).send({
                            err: "Firebase Auth service not found (ENOTFOUND)",
                            details: err.message,
                        });
                    } else {
                        res.status(401).send({
                            err: "invalid auth token",
                            details: err.message,
                        });
                    }
                });
        }
    }
}

export function requireVerification(req: Request, res: Response, next: NextFunction) {
    const uid = req.user;

    admin
        .auth()
        .getUser(uid.valueOf())
        .then((user) => {
            if (user.emailVerified) {
                next();
            } else {
                res.status(403).send({
                    err: "email not verified",
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                err: err.message,
            });
        });
}

/*
    This function exists to account for edge cases where the user has created a firebase account, but for some reason the 
    database failed to process the user's information on account posting.
    Probably deprecated at this point.
*/
export async function createUserIfNoneExists(req: Request, res: Response) {
    try {
        const pool = await getPool();
        const uid = req.user;
        const email = req.email;

        // Check if user already exists
        const checkResult = await pool.request().input("id", uid).query("SELECT id FROM users WHERE id = @id");

        if (checkResult.recordset.length > 0) {
            // User already exists, do nothing
            res.status(200).send({ id: uid });
            return;
        }

        // Insert new user
        const insertResult = await pool
            .request()
            .input("id", uid)
            .input("name", req.body.name)
            .input("email", email)
            .input("weight", req.body.weight).query(`
                INSERT INTO users(id, name, email, weight)
                OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.weight
                VALUES(@id, @name, @email, @weight)
            `);

        res.status(201).send({
            id: insertResult.recordset[0].id,
            name: insertResult.recordset[0].name,
            email: insertResult.recordset[0].email,
            weight: insertResult.recordset[0].weight,
        });
    } catch (err: any) {
        res.status(400).send({
            err: err.message,
        });
        return;
    }
}

export async function replaceUser(deleteUID: string, req: Request, res: Response) {
    const insertUID = req.user;
    const insertEmail = req.email;
    try {
        const pool = await getPool();
        // Delete user by ID
        await pool.request().input("id", deleteUID).query("DELETE FROM users WHERE id = @id");

        // Upsert user (insert or update)
        const upsertQuery = `
            MERGE INTO users WITH (HOLDLOCK) AS target
            USING (SELECT @id AS id, @name AS name, @email AS email, @weight AS weight) AS source
            ON target.id = source.id
            WHEN MATCHED THEN
                UPDATE SET name = source.name, email = source.email, weight = source.weight
            WHEN NOT MATCHED THEN
                INSERT (id, name, email, weight)
                VALUES (source.id, source.name, source.email, source.weight)
            OUTPUT inserted.id, inserted.name, inserted.email, inserted.weight;
        `;

        const result = await pool
            .request()
            .input("id", insertUID)
            .input("name", req.body.name)
            .input("email", insertEmail)
            .input("weight", req.body.weight)
            .query(upsertQuery);

        res.status(201).send(result.recordset[0]);
        return;
    } catch (err: any) {
        res.status(400).send({
            err: err.message,
        });
        return;
    }
}

/*
 * The purpose of this function is to create a user in our DB with regards as to what's on firebase.
 * Firebase is treated as the authority here - Fi
 */
export async function syncFirebaseUserWithDB(req: Request, res: Response) {
    const pool = await getPool();
    const uid = req.user;
    const email = req.email;

    // Check if the user's email exists in the database
    const result = await pool.request().input("email", email).query("SELECT id FROM users WHERE email = @email");

    if (result.recordset.length) {
        const dbUserId = result.recordset[0].id;

        try {
            await admin.auth().getUser(dbUserId);
            // User exists both in firebase and DB.
            // This shouldn't ever happen (since firebase doesn't allow for duplicate emails).
            res.status(409).send({
                err: "Duplicate email issue in Firebase",
            });
            return;
        } catch (err: any) {
            // User doesn't exist in firebase, but exists in DB.
            // Treat Firebase as the authority; Delete the bad entry and replace it with the new one.
            if (err.code !== "auth/user-not-found") {
                res.status(500).send({
                    err: err.message,
                });
                return;
            } else {
                await replaceUser(dbUserId, req, res);
                return;
            }
        }
    } else {
        // User doesn't exist in our database. Create a new user.
        await createUserIfNoneExists(req, res);
        return;
    }
}
