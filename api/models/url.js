const mongoose = require('mongoose');

// Crawl Schema
const urlSchema = mongoose.Schema({
    project_id: {
      type: Number
    },
    address: {
       type: String
    },
    status: {
        type: Number
    },
    links: {
        type: Number
    },
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