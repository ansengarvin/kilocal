
import express from 'express'
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
        admin?: boolean,
        email?: String
      }
    }
  }


app.get('/test', async function (req, res) {
    try {
        // Returns the current time in pacific time
        res.status(200).send({
            time: new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
        })
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