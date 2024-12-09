
import express from 'express'
import 'dotenv/config'
import pg from 'pg'
import { generateAuthToken, requireAuthentication } from './lib/authentication'
var bcrypt = require('bcryptjs')

const app = express();
const port = process.env.PORT || 8000
app.use(express.json());

const {Pool} = pg

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    idleTimeoutMillis: 0
})

app.get('/test', async function (req, res) {
    try {
        const result = await pool.query('SELECT NOW()')
        res.status(200).send({
            message: 'Hello, world!',
            result: result.rows[0].now
        });
    } catch (err) {
        res.status(400).send({
            err: err.message
        })
    }
    
});

app.post('/users', async function (req, res) {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.status(400).send({
                err: "Missing name, email, and/or password."
            })
        }
        bcrypt.hash(req.body.password, 8, async function(err, hash){
            if (err) {
                res.status(400).send({
                    err: err
                })
            } else {
                const text = "INSERT INTO users(name, email, password, weight) VALUES($1, $2, $3, $4) RETURNING id, name, email, weight"
                const values = [req.body.name, req.body.email, hash, req.body.weight]

                const result = await pool.query(text, values)
                console.log("New User:\n" + result.rows)
                res.status(201).send({
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                    weight: result.rows[0].weight,
                    token: generateAuthToken(result.rows[0].id)
                })
            }
        })
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    }

})

app.use('*', function (req, res) {
    res.status(404).json({ error: "Requested resource '" + req.originalUrl + "' Not Found" });
})

app.listen(port, function () {
    console.log('== server is running on PORT:', port);
});