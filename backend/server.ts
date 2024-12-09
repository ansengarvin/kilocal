
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
                // TODO: Check if email is in database first.

                // Adds the user into the database.
                const text = "INSERT INTO users(name, email, password, weight) VALUES($1, $2, $3, $4) RETURNING id, name, email, weight"
                const values = [req.body.name, req.body.email, hash, req.body.weight]
                const result = await pool.query(text, values)

                // Returns user information.
                res.status(201).send({
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                    weight: result.rows[0].weight
                })
            }
        })
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    }
})

app.post('/login', async function(req, res) {
    try {
        // Ensure username and password provided
        if (!req.body.email || !req.body.password) {
            res.status(400).send({err: "Missing email or password"})
        }

        // Grabs user in the database
        const text = "SELECT * FROM users WHERE email = $1"
        const values = [req.body.email]
        const result = await pool.query(text, values)

        // If no user or password incorrect, send error
        
        if (!(result.rowCount && await bcrypt.compare(req.body.password, result.rows[0].password))) {
            console.log(req.body.password)
            console.log(result.rowCount)
            console.log(text, values)
            res.status(401).send({
                err: "Invalid Credentials"
            })
        } else {
            const token = generateAuthToken(result.rows[0].id)
            res.status(200).send ({
                token: token
            })
        }

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