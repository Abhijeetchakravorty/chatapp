var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/authroutes');

////////////////////////////////////////////////////////////////////////////////
//// Start Custom defined imports by Abhijeet Chakravorty
var models = require('./models');
var http = require('http');
var config = require('./config');
var cors = require('cors');
const rateLimit = require("express-rate-limit");
var authentication = require('./services/authentication.service');
var ioService = require('./services/io.service');
// var io = require('./routes/ioSocket');
//// End Custom defined imports by Abhijeet Chakravorty
////////////////////////////////////////////////////////////////////////////////

var app = express();
const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 300 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// app.use('/users', usersRouter);
app.use('/api/users', authentication.authOrigin, usersRouter);
app.use('/api/auth/users', authentication.authenticateToken, authRouter);

app.use(function(req, res, next) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('IP: '+ip);
        let origin = req.get('origin');
        console.log(config.SERVER_PROTOCOL+'://'+config.CHAT_CLIENT_HOST);
        if (origin !== config.SERVER_PROTOCOL+'://'+config.CHAT_CLIENT_HOST) {
                return res.status(404).end();
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
});

// // catch 404 and forward to error handler
app.use(function (req, res, next) {
        next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
});

models.sequelize.sync().then(function () {
        let server;
        console.log('I am here');
        if (config.SERVER_PROTOCOL === 'http') {
                app.set('port', config.SERVER_PORT);
                server = http.createServer(app)
        } else if (config.SERVER_PROTOCOL === 'https') {
                app.set('port', config.SERVER_PORT);
                server = http.createServer(app)
                // var sslOptions = {
                //   cert: fs.readFileSync(config.SSL_CERTIFICATE),
                //   key: fs.readFileSync(config.SSL_CERTIFICATE_KEY)
                // };
                // https.createServer(sslOptions, app).listen(config.SERVER_PORT);
        } else {
                console.error('Unknown server protocol: ' + config.SERVER_PROTOCOL);
                process.exit(1);
        }
        const { Server } = require("socket.io");
        const io = new Server(server, {
                cors: {
                        origin: "*",
                        methods: ["GET", "POST"]
                }
        });
        console.log(config.SERVER_PROTOCOL);
        server.listen(config.SERVER_PORT, () => {
                console.log('App initialized and listening on port ' + config.SERVER_PORT);
        });
        io.on('connection', (socket) => {
                console.log('a user connected');
                socket.on("new user", function (data) {
                        console.log('check start');
                        console.log(data);
                        console.log('check end');
                        // socket.userId = data;
                        // activeUsers.add(data);
                        // io.emit("new user", [...activeUsers]);
                });

                socket.on("send", function (data) {
                        console.log("chat message");
                        ioService.authenticate(data, io, socket);
                        console.log("chat message end");
                });

                socket.on("newevent", function (data) {
                        // io.sockets.emit("receive", data);
                        ioService.authenticate(data, io, socket);  
                });

                socket.on('disconnect', () => {
                        console.log('user disconnected');
                });
        });
});

module.exports = app;
