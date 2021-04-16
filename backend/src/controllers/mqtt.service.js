'use strict';
const db = require('../database');
const mqtt = require('mqtt');
const socket = require('../sokests/sokets');
const server = require('../index');

module.exports = runMQTT;

const HOST = 'localhost';
const DEF_PORT = 1883;
const TOPIC = 'device/#';
// Conection options
const OPTIONS = {
    clientId: 'access_control_server_' + Math.random().toString(16).slice(3),
    username: 'web_client',
    password: '121212',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

async function runMQTT() {
    const client = mqtt.connect(`mqtt://${HOST}:${DEF_PORT}`, OPTIONS);
    client.on('connect', () => {
        console.log('conexion MQTT Exitosa');
        client.subscribe(TOPIC, function (err) {
            console.log(err);
        });
    });

    client.on('message', async function (topic, message) {
        // console.log("Mensaje recibido desde -> " + topic + " Mensaje -> " + message.toString());
        const account = await insertValues(topic, message);
        server.io.refreshData(account.account, account.model);
    });
}

async function insertValues(topic, message) {
    const data = JSON.parse(message.toString());
    const idmodel = topic.split("/");
    const device = await db.Device.findOne({ idModel: idmodel[1] });
    
    const date = Date.now();
    await device.record.push({ time: date, LpS: data.lps, Mc: data.lt });
    await device.save();

    
    const account = await device.account;
    const model = await device.idModel;
    return {account, model};
}
