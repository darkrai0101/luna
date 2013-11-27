/**
 * SERVER
 */ 
var express = require('express');
var	app = module.exports = express();
var http = require('http');
var	server = http.createServer(app);
var path = require('path');
var gapi = require('./lib/gapi');

var nodemailer = require('nodemailer');
var googleapis = require('googleapis');

var store = new express.session.MemoryStore;

var my_calendars = [],
    my_profile = {},
    my_email = '';
    my_test = '';

// var _mysql = require('mysql');
// var mysql = _mysql.createConnection({
// 	host: 'localhost',
// 	port: '3306',
// 	user: 'root',
// 	password: '',
// 	database: 'luna',
// });

app.configure(function(){

	app.use(express.static(__dirname+'/public'));
	app.set('port', process.env.PORT || 3000);
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'trungnv', store: store}));
	app.use(express.methodOverride());
	app.use(app.router);

});

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (!module.parent) {
  app.listen(app.get('port'), function(){
  	console.log('Express server listening on port '+ app.get('port'));
  });
}

function error(status, msg){
	var err = new Error(msg);
	err.status = status;
	return err;
}

//cau hinh loi 500
app.use(function(err, req, res, next){
	res.send(err.status || 500, {error: err.message});
});

//cau hinh loi 404
app.use(function(req, res){
	res.send(404, {error: "Khong tim thay trang nay"});
});

app.use('/', function(req, res, next){
	next();
});

app.get('/', function(req, res){
	//res.send('trang chu');
	var locals = {
		title: 'trang chu',
		url: gapi.url
	};
	res.render('index', locals);
});


app.use('/oauth2callback', function(req, res, next){
	next();
});

app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  gapi.client.getToken(code, function(err, tokens){
    gapi.client.credentials = tokens;
    req.session.token = tokens;
    getData();
  });
  var locals = {
	    title: "These are your calendars",
	    url: '',
	};
	res.render('index', locals);
});

var getData = function() {
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
      console.log(results);
      my_email = results.email;
      my_profile.name = results.name;
      my_profile.birthday = results.birthday;
  });
  gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
    console.log(results);
    for (var i = results.items.length - 1; i >= 0; i--) {
       my_calendars.push(results.items[i].summary);
    };
    my_test = "xem nao";
  });
};

var insertCal = function(){
	//gapi.cal.
};

app.get('/cal', function(req, res){
  var locals = {
    title: "These are your calendars",
    user: my_profile.name,
    bday: my_profile.birthday,
    events: my_calendars,
    email: my_email,
    test: my_test
  };
  res.render('cal', locals);
});