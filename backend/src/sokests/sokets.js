"use strict";

module.exports = {
    disconnect,
    connect,
    refreshData
};

function disconnect() {

};

function connect(client, io) {
    client.on('connection', () => {
        console.log(client.id);
    });
};

function refreshData(client, io, suscribe, data) {
    io.emit(suscribe, data);
}
