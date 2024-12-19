import {Router} from 'express'
var bcrypt = require('bcryptjs')

const router = Router()
import { generateAuthToken, requireAuthentication, validateSameUser } from '../lib/authentication'
import {pool} from '../lib/database'

router.post('/', async function (req, res) {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.status(400).send({
                err: "Missing name, email, and/or password."
            })
        }
        bcrypt.hash(req.body.password, 8, async function(err, hash){
            try {
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
            } catch (err) {
                res.status(400).send({
                    err: err.message
                })
            }
        })
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    }
})

router.post('/login', async function(req, res) {
    try {

        console.log("Login called")
        // Ensure username and password provided
        if (!req.body.email || !req.body.password) {
            console.log(req.body)
            console.log(req.body.email)
            console.log(req.body.password)
            res.status(400).send({err: "Missing email or password"})
        } else {
            // Grabs user in the database
            const text = "SELECT * FROM users WHERE email = $1"
            const values = [req.body.email]
            const result = await pool.query(text, values)

            // If no user or password incorrect, send error
            
            if (!(result.rowCount && await bcrypt.compare(req.body.password, result.rows[0].password))) {
                res.status(401).send({
                    err: "Invalid Credentials"
                })
            } else {
                const token = generateAuthToken(result.rows[0].id)
                res.status(200).send ({
                    id: result.rows[0].id,
                    token: token
                })
            }
        }

        
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    }
})

router.delete('/:user_id', requireAuthentication, validateSameUser, async function (req, res) {
    try {
        console.log("Deleting user", req.params.user_id)
        const text = "DELETE FROM users WHERE id = $1"
        const values = [req.params.user_id]
        await pool.query(text, values)
        res.status(204).send()
    } catch (err) {
        console.log(err)
        res.status(400).send({
            err: err
        })
    }
}) 

module.exports = router