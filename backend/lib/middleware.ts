import { Request, Response, NextFunction } from "express";
import { isDate } from "./utils";
import { getPool } from "./database";

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

/*
    Get day ID for the user based on the date parameter (or creates a day if one does not exist).
    Must be called after requireAuthentication and requireValidDateParam.
*/
export async function requireDayID(req: Request, res: Response, next: NextFunction) {
    try {
        const pool = await getPool();
        let result = await pool
            .request()
            .input("user_id", req.user)
            .input("date", req.params.date)
            .query(
                `
                MERGE INTO days AS target
                USING (SELECT @user_id AS user_Id, @date AS date) AS source
                ON source.user_id = target.user_id AND target.date = source.date
                WHEN MATCHED THEN
                    UPDATE SET user_id = target.user_id
                WHEN NOT MATCHED THEN
                    INSERT (user_id, date)
                    VALUES (source.user_id, source.date)
                OUTPUT INSERTED.id;
            `,
            );
        req.dayID = result.recordset[0].id;
        next();
    } catch (e) {
        console.error("Error in requireDayID:", e);
        res.status(500).send({ err: "Internal server error", details: e.message });
        return;
    }
}
