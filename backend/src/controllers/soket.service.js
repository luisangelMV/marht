const socket = require('socket.io');
const http = require('http');
const socketIO = require('socket.io');
const io = socketIO.Server;
module.exports = {
    desconectar,
    mensaje
}

function desconectar(cliente) {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
};

function mensaje(params) {
    cliente.on('mensaje', (payload) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
}