"use strict";

const db = require('../database');
const AccountModel = require('../models/account.model');
const socketIO = require('socket.io');

module.exports = {
    // createGroup,
    addDevice,
    // AddDeviceGroup,
    getDevices,
    deleteDevice,
    getRecord,
    updateDevice
};

async function updateDevice(req) {
    const device = await db.Device.findOne({ idModel: req.idModel });
    // device.ubication = req.ubication;
    // device.nameModule = req.nameModule;
    await device.updateOne(req);
    await device.save();
    console.log("despues de actualizar  ", device);
    return device;
}
// async function createGroup(req) {
//     const account = await getAccount(req.id);
//     await account.groups.push(req.groups);
//     await account.save();
//     return account;
// }

// async function AddDeviceGroup(req) {
//     const group = await db.Account.groups.findOne(req.id);
//     group.groupDevice.id = req.idshema;
//     group.groupDevice.id = req.idshema; 
// }

async function addDevice(req) {
    const device = await db.Device.findOne({ idModel: req.idModel });
    if (!device) {
        throw 'not found device';
    }

    if (device.account != undefined) {
        if (device.account == req.id) {
            throw 'this device is already associated to your account';
        }
        throw 'this device is already assosiate';
    }
    device.account = req.id;
    device.creationDate = Date.now();
    await device.save();
    const account = await getAccount(req.id);
    await account.devices.push({ idDevice: device._id });
    await account.save();
    return account;

    //return basicDetailsDevice(account);
}

async function deleteDevice(req) {
    const account = await db.Account.updateOne({ _id: req.id }, { $pull: { devices: { idDevice: req.idDevice } } });
    await db.Device.updateOne({_id: req.idDevice},{account: undefined})
    return account;
}

async function getDevices(params) {
    const device = await db.Device.find({ account: params });
    return device;
}

async function getRecord(params) {
    const device = await db.Device.findOne({_id: params});
    return device;
}
// helpers

async function getAccount(id) {
    if (!db.isValidId(id)) throw 'Account not found';
    const account = await db.Account.findById(id);
    if (!account) throw 'Account not found';
    return account;
}