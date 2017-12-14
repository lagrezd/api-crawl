'use strict'

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
var phoneNumbersByPagesVisited = {};
var pagesToVisit = [];

function visitPage(url, baseUrl, callback, res) {
    // Add page/numbers to our set
    phoneNumbersByPagesVisited[url] = {};

    // Make the request
    console.log("Visite de la page " + url);

    request(url, function(error, response, html) {
        //var code = response.statusCode;
        //console.log(error);
        // Check status code (200 is HTTP OK)
        // Parse the document body

        if(response.statusCode && response.statusCode !== 200 && response.statusCode !== '') {
            callback(pagesToVisit, res);
            return;
        }
        var $ = cheerio.load(html);
        //console.log($);

        //collectPhoneNumbers($, url);
        collectInternalLinks($, baseUrl);
        // In this short program, our callback is just calling crawl()
        callback(pagesToVisit, res);
    });
}

function collectPhoneNumbers($, url) {
    $('body').find('div').each(function(i, element) {
        var el = $(this);
        var elementText = el.text();

        if(phoneNumberRegex.test(elementText)) {
            var phoneNumber = elementText.match(phoneNumberRegex).slice(0,1)[0];
            phoneNumbersByPagesVisited[url][phoneNumber] = true;
        }
    })
}

function collectInternalLinks($, baseUrl) {
    //var url = a.attr('href');

    //var relativeLinks = $("a[href^='/']");
    var relativeLinks = $("a[href^='" + baseUrl + "']");
    console.log("Found " + relativeLinks.length + " relative links on page");

    $(relativeLinks).each(function(i, link){
        //console.log($(link).text() + ':\n  ' + $(link).attr('href'));
        console.log($(link).attr('href'));
        //pagesToVisit.push(baseUrl + $(link).attr('href'));
        pagesToVisit.push($(link).attr('href'));
    });
    /*if(relativeLinks) {
        console.log("tu es dans le if");
        relativeLinks.each(function(url) {
            pagesToVisit.push(baseUrl + $(this).attr('href'));
        });
    }*/
}

function recursiveCrawler(pagesToVisit, res) {

    if(pagesToVisit.length === 0) {
        console.log("done recursively crawling!", Object.keys(phoneNumbersByPagesVisited).length);
        res.send(phoneNumbersByPagesVisited).status(200);
        return;
    }

    var nextPage = pagesToVisit.pop();
    var nextUrl = new URL(nextPage);
    var baseUrl = nextUrl.protocol + "//" + nextUrl.hostname;
    console.log(nextPage, phoneNumbersByPagesVisited);

    if (nextPage in phoneNumbersByPagesVisited) {
        // We've already visited this page, so repeat the crawl
        console.log("déjà visité l'url:  ", nextPage)
        recursiveCrawler(pagesToVisit, res);
    } else {
        console.log("nouvelle page non visitée", nextPage);
        // New page we haven't visited
        visitPage(nextPage, baseUrl, recursiveCrawler, res);
    }
}

module.exports = {
    crawl: function (req, res, cb) {
        console.log("firing crawl");
        var startingURLs = req.body.urls;

        startingURLs.forEach(function(url){
            pagesToVisit.push(url);
        });

        recursiveCrawler(pagesToVisit, res);
    }
}