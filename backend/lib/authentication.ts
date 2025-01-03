import express, {Request, Response, NextFunction} from 'express'
import { initializeApp } from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

initializeApp({
    credential: applicationDefault()
})


export function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization") || ""

    if (!authHeader) {
        req.user = ""
        res.status(401).send({
            err: "missing auth token"
        })
    } else {
        const token = authHeader.split("Bearer ")[1]

        if (!token) {
            req.user = ""
            res.status(401).send({
                err: "missing auth token"
            })
        } else {
            getAuth().verifyIdToken(token)
                .then((user) => {
                    req.user = user.uid
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