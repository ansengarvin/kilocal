import {Router} from 'express'
import { requireAuthentication } from '../lib/authentication'
import {pool} from '../lib/database'

const router = Router()

async function check_if_day_exists_or_create(user, date: String) {
    let text = "SELECT id FROM days WHERE date = $1"
    let values = [date]
    let result = await pool.query(text, values)

    if (result.rowCount != 0) {
        return result.rows[0].id
    } else {
        text = "INSERT INTO days(user_id, date) VALUES($1, $2) RETURNING id"
        values = [user, date]
        result = await pool.query(text, values)
        return result.rows[0].id
    }
}

// Make a new day
router.post('/', requireAuthentication, async function(req, res) {
    try {
        // Ensure user_id and date provided
        if (! req.body || !req.body.date) {
            res.status(400).send({err: "Missing date in request body"})

        } else {
            // Checks to see if the date already exists in the database
            var text = "SELECT id FROM days WHERE date = $1";
            var values = [req.body.date];
            var result = await pool.query(text, values);

            if (result.rowCount != 0) {
                // Date already exists.
                res.status(400).send({err: "Date already exists for user"})
                return

            } else {
                // Adds the day into the database
                console.log("Date:", req.body.date)
                text = "INSERT INTO days(user_id, date) VALUES($1, $2) RETURNING id, user_id, date"
                values = [req.user, req.body.date]
                result = await pool.query(text, values)

                // Returns day information
                res.status(201).send({
                    id: result.rows[0].id,
                    user_id: result.rows[0].user_id,
                    date: result.rows[0].date
                })
            }  
        }

        
    } catch( err ) {
        console.log(err)
        res.status(500).send({
            error: "server error"
        })
    }
})

// Add a food to a day
router.post('/days/:date/food', requireAuthentication, async function(req, res) {
    try {
        if (!req.body || !req.body.calories) {
            res.status(400).send({err: "entry must have request body with calories"})
        } else {
            // Gets the user's day ID
            let day_id = check_if_day_exists_or_create(req.user, req.params.date)
        }
    } catch (err) { 
        console.log(err)
        res.status(500).send({
            err: "server error"
        })
    }
})

module.exports = router