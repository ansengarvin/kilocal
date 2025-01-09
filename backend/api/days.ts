import {Router} from 'express'
import { requireAuthentication } from '../lib/authentication'
import {pool} from '../lib/database'

const router = Router()

// Gets a day ID if the day entry exists.
// If the day entry does not exist, creates then returns ID.
async function get_day_id(user_id, date: String) {
    let text = "SELECT id FROM days WHERE user_id = $1 AND date = $2"
    let values = [user_id, date]
    let result = await pool.query(text, values)

    if (result.rowCount != 0) {
        return result.rows[0].id
    } else {
        text = "INSERT INTO days(user_id, date) VALUES($1, $2) RETURNING id"
        values = [user_id, date]
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
        console.log("error in days:", err)
        res.status(500).send({
            error: err
        })
    }
})

// Add a food to a day
router.post('/:date/food', requireAuthentication, async function(req, res) {
    try {
        if (!req.body || req.body.calories===null) {
            res.status(400).send({err: "entry must have request body with calories"})
        } else {
            let day_id = await get_day_id(req.user, req.params.date)
            let text = `
                INSERT INTO Foods(day_id, name, calories, amount, carbs, fat, protein, position)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `
            let values = [
                day_id,
                req.body.name,
                req.body.calories,
                req.body.amount || 1,
                req.body.carbs || 0,
                req.body.fat || 0,
                req.body.protein || 0,
                0 // TODO: Calculate position instead of 0
            ] 
            let result = await pool.query(text, values)

            res.status(201).send({
                id: result.rows[0].id
            })
        }
    } catch (err) { 
        res.status(500).send({
            err: err
        })
    }
})

// Gets the contents of a day
router.get('/:date', requireAuthentication, async function(req, res) {
    try {
        let day_id = await get_day_id(req.user, req.params.date)

        let text = "SELECT id, name, calories, amount, carbs, fat, protein FROM foods WHERE day_id = $1"
        let values = [day_id]
        let result = await pool.query(text, values)

        // Parse returned db numerics from string to floats       

        // Calculate total from food
        let totalCalories = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0
        for (let i = 0; i < result.rows.length; i++) {
            totalCalories += (result.rows[i].calories * result.rows[i].amount)
            totalCarbs += (result.rows[i].carbs * result.rows[i].amount)
            totalProtein += (result.rows[i].protein * result.rows[i].amount)
            totalFat += (result.rows[i].fat * result.rows[i].amount)
        }


        // TODO: Implement recipe getting
        res.status(200).send({
            totalCalories: totalCalories,
            totalCarbs: totalCarbs,
            totalProtein: totalProtein,
            totalFat: totalFat,
            food: result.rows
        })


    } catch(err) {
        console.log("DATE get error:", err)
        res.status(500).send({
            err: err
        })
    }
})

router.delete('/:date/food/:food_id', requireAuthentication, async function(req, res) {
    try {
        let day_id = await get_day_id(req.user, req.params.date)

        let text = `
            DELETE FROM foods
            WHERE id = $1 AND day_id = $2
        `
        let values = [req.params.food_id, day_id]
        let result = await pool.query(text, values)

        // On successful delete, result.rows contains the number of items deleted.
        if (result.rowCount === 0) {
            res.status(404).send({
                err: "Food not found"
            })
        } else {
            res.status(204).send()
        }
    } catch(err){
        res.status(500).send({
            err: err
        })
    }
})

module.exports = router