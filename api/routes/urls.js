const express = require('express');
const router = express.Router();
const crawl = require('crawl');

Url = require('../models/url');

router.get('/', (req, res, next) => {
    Url.getUrls(function (err, urls) {
        if (err) {
            throw err;
        } else {
            res.status(200).json(urls);
        }
    });
});

router.post('/', (req, res, next) => {

    var URL = "http://www.cf2roues.fr";
    //res.status(200).json(URL);

    crawl.crawl(URL, function(err, urls) {
        if (err) {
            console.error("An error occured", err);
            return;
        }
        console.log(JSON.stringify(urls));
        //fs.appendFileSync('output.json', JSON.stringify(pages), function (err) {
        //fs.appendFile('output.json', JSON.stringify(pages), function (err) {
        /*fs.writeFile('output.json', JSON.stringify(pages), function (err) {
            if (err) throw err;
            console.log('Done !');
        });*/

        // res.status(200).json(urls);
        Url.postUrls(function (err, urls) {
            if (err) {
                throw err;
            } else {
                res.json(urls);
            }
        });
    });
});

module.exports = router;