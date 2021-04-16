require('dotenv').config();
require('rootpath')();

const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('src/middleware/error-handler');
const runMQTT = require('./controllers/mqtt.service');
const socket = require('socket.io');
const SocketService = require('./sokests/sokets');

// Middlewares
//app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
runMQTT();


// allow cors requests from any origin and with credentials
app.use(cors({ origin: "http://localhost:4200", credentials: true }));

// api routes
app.use('/', require('./routes/index.routes'));
app.use('/console', require('./routes/console.routes'));
app.use('/accounts', require('./routes/accounts.routes'));
app.use('/admin', require('./routes/admin.routes'));

// global error handler
app.use(errorHandler);


// start server
app.set('port', process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000);

const server = app.listen(app.get('port'), () => {
    console.log('Server listening on port ', app.get('port'));
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    // console.log('socket connection opened:', socket.id);
    SocketService.connect(socket, io);
    SocketService.refreshData(socket, io);
});