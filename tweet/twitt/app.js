var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
const socketIo = require("socket.io");
var cors = require('cors');
var http = require('http');
var socket = require('socket.io')
var moment = require('moment');
var asyn = require('async');
var  _ = require('underscore');
var date = moment().subtract(7, 'day').format('YYYY-MM-DD');
var Twit = require('twit');
const Tweet = require('./mongoose');
const config = require('./db');
const mongoose = require('mongoose');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

var T = new Twit({
  consumer_key:         'conumerkey',
  consumer_secret:      'consumer key secret',
  access_token:         'access token',
  access_token_secret:  'token secret',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

passport.use(new Strategy({
    consumerKey: 'conumerkey',
    consumerSecret: 'consumer key secret',
    callbackURL: 'http://localhost:3000/twitter/return'
}, function(token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})

var app = express();
app.use(cors());
var sockIO = require('socket.io')();
app.sockIO = sockIO;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))
const router = require("express").Router();
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function(req, res) {
	// userDetails = req.user
	if (req.user != undefined) {
		getAllTweet(req.user)
		sockIO.emit('testsocket', req.user);
	}
    res.render('index', {user: req.user})
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/')
})


app.get('/getAllTweet', (req, res) => {
	Tweet.find().then(r => {
		console.log('getAlldata')
		res.json(r)
	})
})

app.get('/deleteAllTweet', (req, res) => {
	Tweet.remove({}).then(r => {
		console.log('deleteAllTweet')
		res.send(false)
	})
})

function getAllTweet (loginUser) {
	var params = {
  q: '#nodejs',
  // count: 100,
  result_type: 'recent',
  lang: 'en',
  order: 'DESC',
  since: date,
  // until:'2019-07-07',
  // id: '2210093600'
}


var params2 = {
  // count: 100,
  result_type: 'recent',
  lang: 'en',
  order: 'DESC',
  since: date,
  // until:'2019-07-07',
  id: loginUser.id
}

// Start User Twitt

T.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params2, async (req, res) => {

  var saveTwitts = _.each(res, (res) => {
		saveTweet (res)
	})

	await Promise.all(saveTwitts).catch((err) => {
	    console.log(err)
	  })
})

// End User Twitt


// Start Friends Twitt
T.get('https://api.twitter.com/1.1/friends/ids.json', params, async (req, res) => {
// console.log(res.ids, res.name)
	var ids = res.ids
	var getAllFriends = _.each(ids, async (i) => {
		var params1 = {
		  // count: 1,
		  result_type: 'recent',
		  lang: 'en',
		  order: 'DESC',
		  since: date,
		  // until:'2019-07-07',
		  id: i
		}
		var allPostData = await T.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params1, async (req, res) => {
			var saveTwitts = _.each(res, (res) => {
				saveTweet (res)
			})

			await Promise.all(saveTwitts).catch((err) => {
			    console.log(err)
			  })
		}).catch((err) => {
           console.log(err)
        })
	})

	await Promise.all(getAllFriends).catch((err) => {
	    console.log(err)
	  })
})

// End Friends Twitt

function saveTweet (data) {
	var hashTags = []
	_.map(data.entities.hashtags, (data) => {
		hashTags.push(data.text)
	})
	const newTwitts = new Tweet({
		name: data.user.name,
	    text: data.text,
	    hashTag: hashTags,
	    location: data.user.location
	  });
	  newTwitts
	      .save()
	      .then(tweet => {
	      	// console.log('new Tweet printed', tweet)
	          // res.json(thread)
	      });
	  // res.json(newThread)
}
}

module.exports = app;
