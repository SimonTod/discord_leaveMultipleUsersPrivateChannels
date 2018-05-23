const DiscordApp = require('./discord_leaveMultipleUsersPrivateChannels');

var discordapp = new DiscordApp();
discordapp.getUserCredentials(function() {
  discordapp.login(function(err0) {
    if (err0)  { console.log(err0) }
    else {
      discordapp.getUsersPrivateChannels(function(err1) {
        if (err1) { console.log(err1) }
        else {
          discordapp.leaveMultipleUsersPrivateChannels(function(err2) {
            if (err2) { console.log(err2) }
            else {
              console.log(discordapp.responseMessages);
            }
          });
        }
      });
    }
    
  });
});