
import express from 'express'
const pgp = require('pg-promise')()
var bcrypt = require('bcryptjs')

const app = express();
const port = process.env.PORT || 8000
app.use(express.json());

app.get('/test', function (req, res) {
    res.json({ message: 'Hello, world!' });
});

app.post('/users', function (req, res) {
    console.log("POST DETECTED")
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.status(400).send({
                err: "Missing name, email, and/or password."
            })
        }
        bcrypt.hash(req.body.password, 8, function(err, hash){
            if (err) {
                res.status(400).send({
                    err: err
                })
            } else {
                console.log(hash)
                res.status(201).send({
                    message: "sent"
                })
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