const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';

const { api: apiAuth } = require('./auth');

// const googleAuth = require('./auth');
// app.use(googleAuth);

app.use(express.static(path.join(process.cwd(), isProd ? 'build' : 'public')));
app.use('/api', apiAuth, (req, res, next) => {
    res.status(200).send('Success');
});
app.use((error, req, res, next) => {
    console.error('Request failed with error:', error);
    res.status(500).send('Error');
});

const server = app.listen(PORT, () => {
    console.log(`Server started and listening on ${server.address().address}:${server.address().port}`);
});
