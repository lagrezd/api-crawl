const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

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
const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
const db = mongoose.connect('mongodb://localhost/api-crawl', options);
if (db.states.connecting != 2) {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
} else {
    console.log('MongoDB Connection is running.');
}



//app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('client'));
app.use('/urls', crawlRoutes);

/*app.use((req, res, next) => {
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
});*/

module.exports = app;