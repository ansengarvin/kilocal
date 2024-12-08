var express = require('express');
var app = express();
const port = process.env.PORT || 8000

const api = require('./api');
app.use(express.json());

app.use('/', api);

app.use('*', function (req, res) {
    res.status(404).json({ error: "Requested resource '" + req.originalUrl + "' Not Found" });
})

app.listen(port, function () {
    console.log('== server is running on PORT:', port);
});