import { Request, Response, NextFunction } from "express";
import { isDate } from "./utils";

export function requireBody(req: Request, res: Response, next: NextFunction) {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send({ err: "Request body is required" });
        console.log("empty body");
        return;
    }
    next();
}

export function requireValidDateParam(req: Request, res: Response, next: NextFunction) {
    if (!req.params.date) {
        res.status(400).send({ err: "Date parameter is required" });
        console.log("no date parameter");
        return;
    }

    if (!isDate(req.params.date)) {
        res.status(400).send({ err: "Date parameter must be in YYYY-MM-DD format" });
        console.log("invalid date parameter", req.params.date);
        return;
    }
    next();
}
