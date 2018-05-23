const DiscordApp = require('./discord_leaveMultipleUsersPrivateChannels');

var discordapp = new DiscordApp();
discordapp.getUserCredentials(function() {
  discordapp.login(function() {
    discordapp.getUsersPrivateChannels(function() {
      discordapp.leaveMultipleUsersPrivateChannels();
    });
  });
});