var request = require("request");
var prompt = require('prompt');

module.exports = class DiscordApp {

  getUserCredentials(callback) {
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
    
    var myThis = this;
    prompt.get(schema, function(  err, result) {
      myThis.email = result.email;
      myThis.password = result.password;
      callback && callback();
    });
  }

  setUserCredentials(email, password) {
    this.email = email;
    this.password = password;
  }

  login(callback) {
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
  
    var myThis = this;
    request(options, function (error, response, body) {
        if (response.statusCode !== 200) return callback && callback("Could not log in");
        myThis.token = body.token;
        return callback && callback();
    });
  }

  getUsersPrivateChannels(callback) {
    var options = { method: 'GET',
    url: 'https://discordapp.com/api/users/@me/channels',
    headers: 
    { 'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Authorization: this.token } };
  
    var myThis = this;
    request(options, function (error, response, body) {
      if (response.statusCode !== 200) return callback && callback("Could not get list of channels");
      myThis.channels = JSON.parse(body);
      return callback && callback();
    });
  }

  leaveMultipleUsersPrivateChannels(callback) {
    var count = 0;
    var check = 0;
    this.responseMessages = [];
    var myThis = this;
    this.channels.forEach(channel => {
      if (channel.type == 3) {
        count++;      
        var options = { 
          method: 'DELETE',
          url: 'https://discordapp.com/api/v6/channels/' + channel.id,
          headers: { 
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            Authorization: this.token
          } 
        };
  
        request(options, function (error, response, body) {
          if (response.statusCode !== 200)
            return callback && callback("Could not leave channel " + channel.id + ".");
          else {
            myThis.responseMessages.push("User left group channel " + channel.id + ". This channel contained users " + channel.recipients.map(e => e.username).join(", ") + ".");            
          }
          check++;
        });
      }
      else {
        check++;
      }
    });

    var interval = setInterval(function() {
      if (check == myThis.channels.length) {
        clearInterval(interval);

        count == 0 ? 
          myThis.responseMessages.push("User had no group channel to leave.") : 
          myThis.responseMessages.push("A total of " + count + " group channels were left by the user.");

        return callback && callback();
      }
    }, 100); 
  }
}