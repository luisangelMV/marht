"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};

Object.defineProperty(exports, "__esModule", { value: true });
const express = __importDefault(require('express'));
const socket = __importDefault(require('socket.io'));
const SocketService = __importStar(require('./sokests/sokets'));
const http = __importDefault(require('http'));

class Server {
    constructor() {
        this.app = express.default();
        this.port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
        this.app.set('port', this.port);
        this.httpServer = new http.default.Server(this.app);
        this.io = socket.default(this.httpServer, {
            cors: {
                origin: "http://localhost:4200",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.listenSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }

    listenSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', (client) => {
            console.log(client.id);
            SocketService.connect(client, this.io);
            SocketService.refreshData(client, this.io);
        });
    }

    start(callback) {
        this.httpServer.listen(this.port, callback)
    }
}

exports.default = Server;