require("dotenv").config();
var keys = require("./keys.js");
// fs is a core Node package for reading and writing files
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// var spotifyId = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

// Takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture the command 
var command = inputString[2];
var name = inputString[3];

if (command == "my-tweets") {
  userTweets(name);
} else if (command == "s") {
  spotifySong(name);
} else if (command == "movie-this") {
  movieInfo(name);
} else if (command == "do-what-it-says") {
  itSays();
} else {
  console.log("Please use one of the following commands to get results: my-tweets, spotify-this-song, movie-this, do-what-it-says")
};

// userTweets handles api connection to twitter api then loops over last 20 tweets based on user inputted username.
// tweets are logged to the console

function userTweets(userName) {

  var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
  });

  var params = {
    screen_name: userName
  };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        var j = i + 1;
        console.log(`Tweet ${j}: ${tweets[i].text}`)
      }

    }
  });
}

// spotifySong is given a song name then it logs back the artist, song name, link to spotify song, and album

function spotifySong(songName) {
  
  if  (!songName) {
    songName = "The Sign Ace of Base";
    }


  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
  });

  spotify.search({
    type: 'track',
    query: songName
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    else {
      console.log("Here are some details about the song you requested:");
      console.log("\n~~~~~~ " + data.tracks.items[0].name + " ~~~~~~");
      console.log("This is how popular the track is " + data.tracks.items[0].popularity + "/100" )
      console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
      console.log("Album: " + data.tracks.items[0].album.name + "\n");
      console.log("Here's a 30 second preview link " + data.tracks.items[0].preview_url);
      }
    // console.log(data);
    // console.log(data.name); 
    // console.log(data[0].href);  
    // var song = JSON.parse(data);
    // console.log(song);
    // console.log(data.tracks.items[0]);
    // console.log(data.tracks.items[0].album.artists);
    // console.log(data.tracks.items[0].album.artists[0].name);
    // console.log(songName);
    // console.log(data.tracks.items[0].album.name);
  });

// by callilng movieInfo we will make an api request to omdb and then log the movie data to the console

function movieInfo(movieTitle) {

  if (movieTitle == undefined) {
    request("http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {

      if (!error && response.statusCode === 200) {
        var data = JSON.parse(body);
      }
      logMovie(data);
    });
  } else {
    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

      // If the request is successful (i.e. if the response status code is 200)
      if (!error && response.statusCode === 200) {

        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        var data = JSON.parse(body);
      }
      logMovie(data);
    });
  }

  function logMovie(data) {
    var movieTitle = data.Title;
    var year = data.Year;
    var imdbRating = data.imdbRating;
    var rtRating = data.Ratings[1].Value;
    var country = data.Country;
    var language = data.Language;
    var plot = data.Plot;
    var actors = data.Actors


    console.log(`Movie Title: ${movieTitle}`);
    console.log(`Year of Release: ${year}`);
    console.log(`IMDB Rating of Movie: ${imdbRating}`);
    console.log(`Rotten Tomatoes Rating of Movie: ${rtRating}`);
    console.log(`Country Movie was Produced in: ${country}`);
    console.log(`Language of Film: ${language}`);
    console.log(`Movie Plot (WARNING SPOILERS): ${plot}`);
    console.log(`Notable Actors in the Film: ${actors}`);

  }
}
function itSays() {
   fs.readFile("random.txt", "utf8", function (error, data) {

         // If the code experiences any errors it will log the error to the console.
         if (error) {
            return console.log(error);
         }

         // We will then print the contents of data
         console.log(data);

         // Then split it by commas (to make it more readable)
         var dataArr = data.split(",");

         // We will then re-display the content as an array for later use.
         console.log(dataArr[0]);
         console.log(dataArr[1]);

         });
   }

