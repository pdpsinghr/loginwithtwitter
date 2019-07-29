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
  consumer_key:         'wiX9OIvgQew2WjlxsSB2f0qjR',
  consumer_secret:      'nkOfp6ZhLjBOSh2rAaeuWZo6gsbHko0njcdO7x0m3S3v6cH6Vl',
  access_token:         '2210093600-NXgc3ouDJjINDAVNwG1GOGEqyMcdEZoZ2PDJPOJ',
  access_token_secret:  '4kkmrFzTkJhambJsixL7drGDVDMJkVScYXmVENreKKOGA',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

// oauth_token=KO3_iQAAAAAAy3EEAAABbDfzGiA&oauth_verifier=L8C5IB8elxY56Wkqrudff6D0GPXJtlNj


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
  // id: '1492538024'
}


// https://api.twitter.com/1.1/followers/ids.json

// Start User Twitt

T.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params2, async (req, res) => {
  // console.log('resrponde', res.length)
  // saveTweet (res)
  var saveTwitts = _.each(res, (res) => {
		saveTweet (res)
		// var allPostData = await T.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params1, (req, res) => {
		// 	console.log(res)
		// }).catch((err) => {
  //          console.log(err)
  //       })
	})

	await Promise.all(saveTwitts).catch((err) => {
	    console.log(err)
	  })
 //  await twitts.create(res).catch(err => {

 //  })
 //  var newTwitts = new that({
 //      email: profile.emails[0].value,
 //      twitterProvider: {
 //        id: profile.id,
 //        token: token,
 //        tokenSecret: tokenSecret
 //      }
 //    });
 //  newTwitts.save(function(error, savedUser) {
	//   if (error) {
	//     console.log(error);
	//   }
	//   return cb(error, savedUser);
	// });
})

// End User Twitt

// Start Friends Twitt
T.get('https://api.twitter.com/1.1/friends/ids.json', params, async (req, res) => {
// console.log(res.ids, res.name)
	var ids = res.ids
	var getAllFriends = _.each(ids, async (i) => {
		var params1 = {
		  count: 1,
		  result_type: 'recent',
		  lang: 'en',
		  order: 'DESC',
		  since: date,
		  // until:'2019-07-07',
		  id: i
		}
		var allPostData = await T.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params1, async (req, res) => {
			// console.log(res)
			var saveTwitts = _.each(res, (res) => {
				saveTweet (res)
				// var allPostData = await T.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params1, (req, res) => {
				// 	console.log(res)
				// }).catch((err) => {
		  //          console.log(err)
		  //       })
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
  // var nbFollowers = res.ids.length
  // var id = []
  // console.log(nbFollowers)                                       // how many followers I have
  // for (i=0 ; i <= nbFollowers ; i++) {
  //   ids = res.ids
  //   var id = ids[i]
  //   T.get('users/show/' + id, function(err, data)  {    
  //     console.log(id + " - " + data.id + " - " + data.screen_name)
  //   })
  // }
})

// End Friends Twitt


// T.get('search/tweets', params, function(err, data, response) {

//   // If there is no error, proceed
//   if(!err){
//     // Loop through the returned tweets
//     for(let i = 0; i < data.statuses.length; i++){
//       // Get the tweet Id from the returned data
//       let id = { id: data.statuses[i].id_str }
//       // Try to Favorite the selected Tweet
//       console.log('id', data.statuses[i])
//     }
//   } else {
//     console.log(err);
//   }
// })

function saveTweet (data) {
	// console.log('data user', data.user)
	// console.log('data user', data[0].user.name)
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
	      	console.log('new Tweet printed', tweet)
	          // res.json(thread)
	      });
	  // res.json(newThread)
}