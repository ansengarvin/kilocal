import {Router} from 'express'
var bcrypt = require('bcryptjs')


const router = Router()
import { requireAuthentication} from '../lib/authentication'
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

router.post('/login', requireAuthentication, async function(req, res) {
    try {
        // Grab firebase user id
        const uid = req.user

        // Check if user exists in database
        const text = "SELECT id, name, email, weight FROM users WHERE id = $1"
        const values = [uid]

        await pool.query(text, values)
            .then((result) => {
                if (result.rowCount) {
                    res.status(200).send(result.rows[0])
                } else {
                    // Create user in database if user not found
                    const text = "INSERT INTO users(id) VALUES($1) RETURNING id, name, email, weight"
                    const values = [uid]
                    pool.query(text, values)
                        .then((result: any) => {
                            res.status(201).send(result.rows[0])
                        })
                        .catch((err: any) => {
                            res.status(400).send({
                                err: err.message
                            })
                        })

                }
            })
            .catch((err) => {
                res.status(400).send({
                    err: err.message
                })
            })
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    }
})

router.delete('/:user_id', requireAuthentication, async function (req, res) {
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

router.get('/', requireAuthentication, async function (req, res) {
    try {
        const text = "SELECT id, name, email, weight FROM users WHERE id = $1"
        const values = [req.user]
        const result = await pool.query(text, values)
        console.log("get user id:", req.user)
        if (result.rowCount) {
            res.status(200).send(result.rows[0])
        } else {
            res.status(404).send({
                err: "User not found"
            })
        }
    } catch (err) {
        res.status(400).send({
            err: err.message
        })
    }
})

module.exports = router