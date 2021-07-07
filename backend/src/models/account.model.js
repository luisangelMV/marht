const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");
const device = require('./device.model');
let rolesValidators = {
    values: ['ADMIN', 'USER'],
    message: '{values} no es un role valido'
}

let connectionValidators = {
    values: ['gprs', 'wifi'],
    message: '{values}'
}

const schema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
        type: String,
        required: true,
        default: 'USER',
        enum: rolesValidators
    },
    last_session: { type: Date },
    verificationToken: String,
    verified: Date,
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    groups: [{
        nameModule: { type: String, required: true },
        ubication: { type: String, required: true },
        numberModule: { type: Number },
        numberofDevice: { type: Number, required: true, default: 1 },
        nameWifi: { type: String },
        passwordWifi: { type: String },
        groupDevice: [{
            idDevice: { type: Schema.Types.ObjectId, ref: 'Device' },
        }]
    }],
    devices: [{
        idDevice: { type: Schema.Types.ObjectId, ref: 'Device' }
    }]
}, {
    timestamps: true
});

schema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

schema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

module.exports = model('Account', schema);