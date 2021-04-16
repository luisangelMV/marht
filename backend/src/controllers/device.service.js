const Device = require('../models/device.model');
const Role = require('../models/role');

module.exports = {
    createDevice
}

async function createDevice(params, ip) {
    const id = await createId(params.telemetry.method);
    const device = new Device(params);
    device.idModel = id;
    device.createdByIp = ip;
    await device.save();
    
    return device;
}


async function createId(method) {

    for (var i = 0; i < 5; i++) {
        i += i;
        var id = '';
        if (method === 'gprs') {
            id = 'A' + Math.random().toString().slice(2, 10);
        }

        if (method === 'wifi') {
            id = 'B' + Math.random().toString().slice(2, 10);
        }

        const devices = await Device.findOne({ idModel: id });
        if (devices === null) {
            return id;
        }
    }

}