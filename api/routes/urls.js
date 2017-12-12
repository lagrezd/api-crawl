const express = require('express');
const router = express.Router();


Url = require('../models/url');

router.get('/', (req, res, next) => {
    var val = req.query.search;
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
        "%20where%20location%3D%22sfbay%22%20and%20type%3D%22jjj%22%20and%20query%3D%22" + val + "%22&format=" +
        "json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    console.log(url);
    Url.getUrls(function (err, urls) {
        if (err) {
            throw err;
        } else {
            res.status(200).json(urls);
        }
    });
});

router.post('/', (req, res, next) => {

    Url.postUrls(function (err, urls) {
        if (err) {
            throw err;
        } else {
            res.status(200).json(urls);
        }
    });
});

module.exports = router;