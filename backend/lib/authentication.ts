import express, {Request, Response, NextFunction} from 'express'
import admin from 'firebase-admin'
import { pool } from './database'

admin.initializeApp({
    credential: admin.credential.cert("./etc/keys/service.json")
})

export function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization") || ""

    if (!authHeader) {
        req.user = ""
        res.status(401).send({
            err: "no authorization header"
        })
    } else {
        const token = authHeader.split("Bearer ")[1]

        if (!token) {
            req.user = ""
            res.status(401).send({
                err: "missing auth token"
            })
        } else {
            admin.auth().verifyIdToken(token)
                .then((user) => {
                    req.user = user.uid
                    req.email = user.email
                    next()
                })
                .catch((err) => {
                    req.user = ""
                    res.status(401).send({
                        err: "invalid auth token"
                    })
                })
        }
    }
}

export function requireVerification(req: Request, res: Response, next: NextFunction) {
    const uid = req.user

    admin.auth().getUser(uid.valueOf())
        .then((user) => {
            if (user.emailVerified) {
                next()
            } else {
                res.status(403).send({
                    err: "email not verified"
                })
            }
        })
        .catch((err) => {
            res.status(400).send({
                err: err.message
            })
        })
}

/*
    This function exists to account for edge cases where the user has created a firebase account, but for some reason the 
    database failed to process the user's information on account posting.
    Probably deprecated at this point.
*/
export async function createUserIfNoneExists(req: Request, res: Response) {
    try {
        const uid = req.user
        const email = req.email

        const text = `
            INSERT INTO users(id, name, email, weight)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (id) DO NOTHING
            RETURNING id, name, email, weight
        `
        const values = [uid, req.body.name, email, req.body.weight]
    
        // This returning sucessfully means either the user has been created, or it already exists.
        await pool.query(text, values)

        res.status(201).send({
            id: uid
        })
    } catch (err: any) {
        console.log(err.message)
        res.status(400).send({
            err: err.message
        })
        return
    }
}

export async function replaceUser(deleteUID: string, req: Request, res: Response) {
    const insertUID = req.user
    const insertEmail = req.email
    try {
        const deleteText = `DELETE FROM users WHERE id = $1`
        const insertText = `
            INSERT INTO users(id, name, email, weight)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                weight = EXCLUDED.weight
            RETURNING id, name, email, weight
        `;
        const deleteValues = [deleteUID]
        const insertValues = [insertUID, req.body.name, insertEmail, req.body.weight]

        // Execute delete query
        await pool.query(deleteText, deleteValues)

        // Execute insert query
        const result = await pool.query(insertText, insertValues)

        res.status(200).send(result.rows[0])
        return
    } catch (err) {
        res.status(400).send({
            err: err.message
        })
        return
    }
}

/*
 * The purpose of this function is to create a user in our DB with regards as to what's on firebase.
 * Firebase is treated as the authority here - Fi
 */
export async function syncFirebaseUserWithDB(req: Request, res: Response) {
    const uid = req.user
    const email = req.email

    // Check if the user's email exists in the database
    var text = "SELECT id FROM users WHERE email = $1"
    var values = [email]
    var result = await pool.query(text, values)
    if (result.rowCount) {
        const dbUserId = result.rows[0].id

        try {
            await admin.auth().getUser(dbUserId)
            // User exists both in firebase and DB. 
            // This shouldn't ever happen (since firebase doesn't allow for duplicate emails).
            res.status(409).send({
                err: "Duplicate email issue in Firebase"
            })
            return
        } catch (err) { 
            // User doesn't exist in firebase, but exists in DB.
            // Treat Firebase as the authority; Delete the bad entry and replace it with the new one.
            if (err.code !== "auth/user-not-found") {
                res.status(500).send({
                    err: err.message
                })
                return
            } else {
                await replaceUser(dbUserId, req, res);
                return
            }
            
        }

    }
    else {
        // User doesn't exist in our database. Create a new user.
        await createUserIfNoneExists(req, res)
        return
    }
}