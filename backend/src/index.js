require('dotenv').config();
require('rootpath')();

const helmet = require('helmet');
const express = require('express');
const Server = require('./server');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('src/middleware/error-handler');
const runMQTT = require('./controllers/mqtt.service');

const server = Server.default.instance;

// Middlewares
//app.use(helmet());
server.app.use(express.urlencoded({ extended: false }));
server.app.use(express.json());
server.app.use(cookieParser());
runMQTT();


// allow cors requests from any origin and with credentials
server.app.use(cors({ origin: "http://localhost:4200", credentials: true }));

// api routes
server.app.use('/', require('./routes/index.routes'));
server.app.use('/console', require('./routes/console.routes'));
server.app.use('/accounts', require('./routes/accounts.routes'));
server.app.use('/admin', require('./routes/admin.routes'));

// global error handler
server.app.use(errorHandler);


// start server
server.app.set('port', process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000);

server.start(()=>{
    console.log(`server runing in port ${server.port }`);
});