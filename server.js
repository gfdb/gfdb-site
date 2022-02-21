const express = require('express');

const app = express();

app.get('/home', (req, res) => {
    res.render()
});

const port = 8000;

app.listen(port, () => console.log('Server started on port ${port}'))