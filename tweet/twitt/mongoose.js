'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    name: {
      type: String, required: true
    },
    text: {
      type:  String
    },
    hashTag: {
      type: Array
    },
    location: {
      type: String
    }
});

const Tweet = mongoose.model('threads', TweetSchema);

module.exports = Tweet;