import {Router} from 'express'
import { requireAuthentication } from '../lib/authentication'
import {pool} from '../lib/database'

const router = Router()

// Make a new day
router.post('/', requireAuthentication, async function(req, res) {
    try {
        // Ensure user_id and date provided
        if (!req.body.date) {
            res.status(400).send({err: "Missing date in request body"})
            return
        }
        // Adds the day into the database
        console.log("Date:", req.body.date)
        const text = "INSERT INTO days(user_id, date) VALUES($1, $2) RETURNING id, user_id, date"
        const values = [req.user, req.body.date]
        const result = await pool.query(text, values)

        // Returns day information
        res.status(201).send({
            id: result.rows[0].id,
            user_id: result.rows[0].user_id,
            date: result.rows[0].date
        })
    } catch( err ) {
        console.log(err)
        res.status(500).send({
            error: "Error creating day."
        })
    }
})

module.exports = router