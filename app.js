var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('Mongo connected');
});

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


// listen on port 3000
http.listen(port, function() {
    console.log("port");
    console.log('Express app listening on port:' + port);
});

//socket code for emitting and receiving mesages and names of connected users.
io.sockets.on('connection', function (socket, data) {
    var username='';
    socket.on('new_client', function (data) {
        /*name = ent.encode(name);*/
        username = data;
        console.log(data);
        //socket.emit('new_client', data);
    });
    /*socket.on('connection', function (socket) {*/
    socket.on('chat message', function (msg) {
        //console.log(name);
        io.emit('chat message', username + ': ' +msg);
        console.log(msg);
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
});
