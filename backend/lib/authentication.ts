import 'dotenv/config'
import express from 'express'
var jwt = require('jsonwebtoken')

export function generateAuthToken(userId: number, admin: boolean = false) {
    const payload = {
        sub: userId.toString(),
        admin: admin
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
}

export function requireAuthentication(req, res, next) {
    const authHeader = req.get("Authorization") || ""

    if (!authHeader) {
        req.user = ""
        res.status(401).send({
            err: "missing auth token"
        })
    } else {
        const authHeaderSplit = authHeader.split(" ")
        console.log(authHeader)
        console.log(authHeaderSplit)
        const token = authHeaderSplit[0] === "Bearer" ? authHeaderSplit[1] : null
        console.log(token)

        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY)
            req.user = payload.sub
            req.admin = payload.admin
            next()
        } catch (err) {
            res.status(403).send({
                error: "Invalid authentication token"
            })
        }
    }
}