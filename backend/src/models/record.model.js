const { Schema, model } = require('mongoose');
const device = require('./device.model');

var recordShema = new Schema({
    deviceId: {type: Schema.Types.ObjectId, ref: 'Device'},
    Record:[{
        time: { type: Date, default: Date.now },
        LpS: Number,
        Mc: Number
    }]
});


deviceShema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = model('Record', recordShema);