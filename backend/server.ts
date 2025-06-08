import express from "express";
import { poolPromise } from "./lib/database";

let api = require("./api");
let cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());

// TODO: Change origin to prod origin
app.use(
    cors({
        origin: process.env.CORS_URL ? process.env.CORS_URL : "*",
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);
app.use("/", api);

declare global {
    namespace Express {
        interface Request {
            user?: string;
            admin?: boolean;
            email?: string;
            dayID?: number;
        }
    }
}

app.get("/test", async function (req, res) {
    try {
        // Returns the current time in pacific time
        res.status(200).send({
            time: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        });
    } catch (err) {
        res.status(400).send({
            err: err.message,
        });
    }
});

app.use("*", function (req, res) {
    res.status(404).json({ error: "Requested resource '" + req.originalUrl + "' Not Found" });
});

async function startServer() {
    try {
        await poolPromise;
        app.listen(port, function () {
            console.log("== server is running on PORT:", port);
        });
    } catch (err) {
        console.log("Error connecting to database: ", err);
        throw err;
    }
}

startServer();
