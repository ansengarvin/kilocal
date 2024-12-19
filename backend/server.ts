
import express from 'express'
import 'dotenv/config'
import {pool} from './lib/database'


var api = require('./api')
var cors = require('cors')

const app = express();
const port = process.env.PORT || 8000
app.use(express.json());

// TODO: Change origin to prod origin
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}))
app.use('/', api)

declare global {
    namespace Express {
      interface Request {
        user?: String,
        admin?: boolean
      }
    }
  }


app.get('/test', async function (req, res) {
    try {
        const result = await pool.query('SELECT NOW()')
        res.status(200).send({
            message: 'time:',
            result: result.rows[0].now
        });
    } catch (err) {
        res.status(400).send({
            err: err.message
        })
    }
    
});

app.use('*', function (req, res) {
    res.status(404).json({ error: "Requested resource '" + req.originalUrl + "' Not Found" });
})

app.listen(port, function () {
    console.log('== server is running on PORT:', port);
});