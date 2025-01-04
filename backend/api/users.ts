import {Router} from 'express'
var bcrypt = require('bcryptjs')

const router = Router()
import { createUserIfNoneExists, requireAuthentication} from '../lib/authentication'
import {pool} from '../lib/database'
import { create } from 'ts-node'

router.post('/', requireAuthentication, async function (req, res) {
    try {
        await createUserIfNoneExists(req, res)
        res.status(201).send()
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    } 
})

router.post('/login', requireAuthentication, async function(req, res) {
    try {
        await createUserIfNoneExists(req, res)
        res.status(200).send({})
    } catch(err) {
        res.status(400).send({
            err: err.message
        })
    }
})

router.delete('/:user_id', requireAuthentication, async function (req, res) {
    try {
        const text = "DELETE FROM users WHERE id = $1"
        const values = [req.params.user_id]
        await pool.query(text, values)
        res.status(204).send()
    } catch (err) {
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