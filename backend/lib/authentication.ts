import express, {Request, Response, NextFunction} from 'express'
import admin from 'firebase-admin'
import { pool } from './database'

admin.initializeApp({
    credential: admin.credential.cert("./lib/keys/service.json")
})

export function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization") || ""
    console.log("IN REQUIRES AUTHENTICATION")

    if (!authHeader) {
        req.user = ""
        res.status(401).send({
            err: "no authorization header"
        })
        console.log("no auth header")
    } else {
        const token = authHeader.split("Bearer ")[1]

        if (!token) {
            req.user = ""
            res.status(401).send({
                err: "missing auth token"
            })
        } else {
            console.log("Verifying token")
            admin.auth().verifyIdToken(token)
                .then((user) => {
                    console.log("User verified")
                    req.user = user.uid
                    req.email = user.email
                    next()
                })
                .catch((err) => {
                    req.user = ""
                    console.log("error:", err)
                    res.status(401).send({
                        err: "invalid auth token"
                    })
                })
        }
    }
}

export async function createUserIfNoneExists(req: Request, res: Response) {
    console.log("Checking if user exists")
    const uid = req.user
    const email = req.email

    const text = "SELECT id, name, email, weight FROM users WHERE id = $1"
    const values = [uid]

    await pool.query(text, values)
        .then((result) => {
            if (result.rowCount) {
                console.log("User exists. Returning.")
                return;
            } else {
                ("User does not exist in our DB. Creating user.")
                const text = "INSERT INTO users(id, name, email, weight) VALUES($1, $2, $3, $4) RETURNING id, name, email, weight"
                const values = [uid, "test", email, 0]
                pool.query(text, values)
                    .then((result: any) => {
                        return;
                    })
                    .catch((err: any) => {
                        console.log("error creating user:", err)
                        res.status(400).send({
                            err: err.message
                        })
                    })
            }
        })
        .catch((err: any) => {
            console.log("pool error:", err)
            res.status(400).send({
                err: err.message
            })
        })
}