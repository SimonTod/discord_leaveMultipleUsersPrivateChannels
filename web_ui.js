var express = require('express');
var bodyParser = require('body-parser');
var DiscordApp = require('./discord_leaveMultipleUsersPrivateChannels');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');
app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});

app.post('/discord_leave-multiple-users-private-channels', function(req, res) {

  var discordapp = new DiscordApp();
    discordapp.setUserCredentials(req.body.email, req.body.password);
    discordapp.login(function(err0) {
      if (err0)
        res.send({success: false, message: err0});
      else 
        discordapp.getUsersPrivateChannels(function(err1) {
          if (err1)
            res.send({success: false, message: err1});
          else
            discordapp.leaveMultipleUsersPrivateChannels(function(err2) {
              if (err2)
                res.send({success: false, message: err2});
              else
                res.send({
                  success: true,
                  messages: discordapp.responseMessages
                });
            });
        });
    });
});

app.listen(3000);