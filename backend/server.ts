
import express from 'express'
import 'dotenv/config'
import pg from 'pg'
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
        console.log("Trying to connect to " + "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME)

        const result = await pool.query('SELECT NOW()')
        console.log(result)
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