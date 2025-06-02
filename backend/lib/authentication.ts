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
        return;
    } else {
        const token = authHeader.split("Bearer ")[1];

        if (!token) {
            req.user = "";
            res.status(401).send({
                err: "missing auth token",
            });
            return;
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
                    if (err.message.includes("ENOTFOUND")) {
                        res.status(503).send({
                            err: "Firebase Auth service not found (ENOTFOUND)",
                            details: err.message,
                        });
                        return;
                    } else {
                        res.status(401).send({
                            err: "invalid auth token",
                            details: err.message,
                        });
                        return;
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
                return;
            }
        })
        .catch((err) => {
            res.status(400).send({
                err: err.message,
            });
            return;
        });
}
