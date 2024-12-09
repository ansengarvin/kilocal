
import express from 'express';
const app = express();
const port = process.env.PORT || 8000
app.use(express.json());

app.get('/test', function (req, res) {
    console.log('== req.body:', req.body);
    res.json({ message: 'Hello, world!' });
});

app.use('*', function (req, res) {
    res.status(404).json({ error: "Requested resource '" + req.originalUrl + "' Not Found" });
})

app.listen(port, function () {
    console.log('== server is running on PORT:', port);
});