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
            error: err
        })
    }
})

// Add a food to a day
router.post('/:date/food', requireAuthentication, async function(req, res) {
    try {
        if (!req.body || !req.body.calories) {
            res.status(400).send({err: "entry must have request body with calories"})
        } else {
            let day_id = await check_if_day_exists_or_create(req.user, req.params.date)

            let text = "INSERT INTO Foods(day_id, name, calories, position) VALUES($1, $2, $3, $4) RETURNING id"
            let values = [day_id, req.body.name, req.body.calories, 0] // TODO: Calculate position instead of 0
            let result = await pool.query(text, values)

            res.status(201).send({
                id: result.rows[0].id
            })
        }
    } catch (err) { 
        console.log(err)
        res.status(500).send({
            err: err
        })
    }
})

// Gets the contents of a day
router.get('/:date', requireAuthentication, async function(req, res) {
    try {
        let day_id = await check_if_day_exists_or_create(req.user, req.params.date)

        let text = "SELECT id, name, calories FROM foods WHERE day_id = $1"
        let values = [day_id]
        let result = await pool.query(text, values)

        // TODO: Implement recipe getting

        res.status(200).send({
            food: result.rows
        })


    } catch(err) {
        console.log(err)
        res.status(500).send({
            err: err
        })
    }
})

module.exports = router