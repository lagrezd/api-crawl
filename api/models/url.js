const mongoose = require('mongoose');

// Crawl Schema
const urlSchema = new mongoose.Schema({
    title: String,
    project_id: Number,
    address: String,
    status: Number,
    links: Array,
    created_date: {
        type: Date,
        created_date: Date.now
    }
});

const Url = module.exports = mongoose.model('Url', urlSchema);

module.exports.getUrls = function (callback, limit) {
    Url.find(callback).limit(limit);
}

module.exports.postUrls = function (callback, limit) {
    Url.create(callback);
}