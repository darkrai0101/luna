var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '58058715382.apps.googleusercontent.com',
    secret = 'ZOjZvcz7rx4P0WXoFH1Ztq6j',
    redirect = 'http://amduonglich.herokuapp.com/oauth2callback',
    calendar_auth_url = '',
    oauth2Client = new OAuth2Client(client, secret, redirect);

exports.ping = function() {
    console.log('pong');
};

calendar_auth_url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
});

var callback = function(clients) {
  console.log(clients);
  exports.cal = clients.calendar;
  exports.oauth = clients.oauth2;
  exports.client = oauth2Client;
  exports.url = calendar_auth_url;
};

googleapis.discover('calendar', 'v3').discover('oauth2', 'v2').execute(function(err, client){
    if(!err)
      callback(client);
  });