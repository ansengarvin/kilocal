import {Router} from 'express'
var bcrypt = require('bcryptjs')


const router = Router()
import { createUserIfNoneExists, requireAuthentication} from '../lib/authentication'
import {pool} from '../lib/database'

router.put('/', requireAuthentication, async function (req, res) {
    // Update a user's information. Requires user firebase token to accomplish.
    try {
        // If user does not exist in DB, create them
        const text = `
            INSERT INTO users(id, name, email, weight) VALUES($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, weight = $4
            RETURNING id, name, email, weight
        `
        const values = [req.user, req.body.name, req.body.email, req.body.weight]
        await pool.query(text, values)
            .then((result: any) => {
                res.status(200).send(result.rows[0])
            })
            .catch((err: any) => {
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

router.post('/login', requireAuthentication, async function(req, res) {
    createUserIfNoneExists(req, res);
    try {
        res.status(200).send({})
    } catch(err) {
        console.log("error:", err)
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