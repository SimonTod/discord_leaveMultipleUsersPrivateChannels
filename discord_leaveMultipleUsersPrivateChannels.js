var request = require("request");
var prompt = require('prompt');

function DiscordApp() {};

DiscordApp.prototype.getUserCredentials = function(callback) {
  var schema = {
    properties: {
      email: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Please enter a valid email address',
        required: true
      },
      password: {
        hidden: true,
        required: true
      }
    }
  };
  
  prompt.start();
  
  prompt.get(schema, function(err, result) {
    DiscordApp.prototype.email = result.email;
    DiscordApp.prototype.password = result.password;
    callback && callback();
  });
}

DiscordApp.prototype.login = function(callback) {
  var options = { method: 'POST',
  url: 'https://discordapp.com/api/v6/auth/login',
  headers: { 
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json' 
  },
  body: { 
      captcha_key: null,
      email: this.email,
      password: this.password,
      undelete: false },
      json: true 
  };

  request(options, function (error, response, body) {
      if (response.statusCode !== 200) throw new Error("Could not log in");
      DiscordApp.prototype.token = body.token;
      callback && callback();
  });
}

DiscordApp.prototype.getUsersPrivateChannels = function(callback) {
  var options = { method: 'GET',
  url: 'https://discordapp.com/api/users/@me/channels',
  headers: 
   { 'Cache-Control': 'no-cache',
     'Content-Type': 'application/json',
     Authorization: this.token } };

  request(options, function (error, response, body) {
    if (response.statusCode !== 200) throw new Error("Could not get list of channels");
    DiscordApp.prototype.channels = JSON.parse(body);
    callback && callback();
  });
}

DiscordApp.prototype.leaveMultipleUsersPrivateChannels = function(callback) {
  this.channels.forEach(channel => {
    if (channel.recipients.length > 1) {
      var options = { method: 'DELETE',
      url: 'https://discordapp.com/api/v6/channels/' + channel.id,
      headers: 
      { 'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: this.token } };

      request(options, function (error, response, body) {
        if (response.statusCode !== 200) throw new Error("Could not leave channel" + channel.id);
        console.log("User left channel " + channel.id + ". This channel contained users " + channel.recipients.map(e => e.username).join(", ") + ".");
      });
    }
  });

  callback && callback();
}

var discordapp = new DiscordApp();
discordapp.getUserCredentials(function() {
  discordapp.login(function() {
    discordapp.getUsersPrivateChannels(function() {
      discordapp.leaveMultipleUsersPrivateChannels();
    });
  });
});
