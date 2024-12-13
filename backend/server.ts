
import express from 'express'
import 'dotenv/config'
import { generateAuthToken, requireAuthentication } from './lib/authentication'
const pool = require('./lib/database')


var api = require('./api')

const app = express();
const port = process.env.PORT || 8000
app.use(express.json());
app.use('/', api)


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

app.post('/users/:id/days/:date/foods', requireAuthentication, async function(req, res) {
    try {
        if (! req.body.calories) {
            res.status(400).send({
                error: "Request body must contain calories"
            })
        } else {
            // TODO: If no position provided, calculate position based on the positions of other foods and recipes on this day.

            // TODO: If position provided, insert into position and push all other positions down. Will need to use a transaction to do this in batch.

            // Insert the food into the database
            const text = 'INSERT INTO foods(date, user_id, name, calories, position) VALUES($1, $2, $3, $4, $5) RETURNING id'
            const values = [req.params.date, req.params.id, req.body.id, req.body.calories, 0]

            const result = await pool.query(text, values)

            if (!result.rowCount) {
                res.status(400).send({
                    error: "Error inserting food"
                })
            } else {
                res.status(201).send({
                    id: result.rows[0].id
                })
            }
        }

    } catch (err) {
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