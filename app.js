const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// URls
const crawlRoutes = require('./api/routes/urls');

app.use(morgan('dev'));

/**
 * Connect to Mongoose
 *
 * db: api-crawl
 * collections: urls
 * object: address, status code, links, created_date
 */
mongoose.connect('mongodb://localhost/api-crawl');
const db = mongoose.connection;

app.use('/urls', crawlRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        err: {
            message: error.message
        }
    });
});

module.exports = app;