const { Schema, model } = require('mongoose');


var deviceShema = new Schema({
    idModel: { type: String, require: true },
    creationDate: { type: Date },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    microcontroller: { type: String, require: true, default: 'esp32' },
    versionSoftware: { type: String, require: true, default: '1.0' },
    telemetry: {
        method: { type: String, require: true },
        userWifi: String,
        passwordWifi: String,
        gprsDevice: String,
        imei: String,
        number: String
    },
    Sensor: {
        model: { type: String, require: true },
        size: { type: Number }
    },
    createdByIp: { type: String, required: true },
    record: [{
        time: { type: Date, default: Date.now },
        LpS: Number,
        Mc: Number
    }]
}, {
    timestamps: true
});

deviceShema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});
module.exports = model('Device', deviceShema);